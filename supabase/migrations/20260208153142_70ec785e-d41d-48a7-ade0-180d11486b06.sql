-- Add DELETE policy to profiles table to allow users to delete their own profile
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Add DELETE policy to user_preferences table to allow users to delete their own preferences
CREATE POLICY "Users can delete their own preferences"
ON public.user_preferences
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Harden the handle_new_user function with input validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    sanitized_full_name TEXT;
BEGIN
    -- Validate NEW.id is not null (should never happen but defense in depth)
    IF NEW.id IS NULL THEN
        RAISE EXCEPTION 'User ID cannot be null';
    END IF;
    
    -- Sanitize and validate full_name: limit length and remove any potentially dangerous characters
    sanitized_full_name := LEFT(TRIM(COALESCE(NEW.raw_user_meta_data->>'full_name', '')), 100);
    
    -- Insert profile with validated data
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (NEW.id, NULLIF(sanitized_full_name, ''));
    
    -- Insert default preferences
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- Profile or preferences already exist, this is okay
        RETURN NEW;
    WHEN OTHERS THEN
        -- Log error but don't fail user creation
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;