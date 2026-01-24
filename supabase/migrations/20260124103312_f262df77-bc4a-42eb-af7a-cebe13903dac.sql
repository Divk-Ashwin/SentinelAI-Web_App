-- Create enum types
CREATE TYPE public.risk_level AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE public.analysis_language AS ENUM ('english', 'hindi', 'telugu');

-- Create analyses table
CREATE TABLE public.analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    sender_phone TEXT NOT NULL,
    message_content TEXT NOT NULL,
    date_received DATE NOT NULL,
    time_received TIME NOT NULL,
    screenshot_url TEXT,
    language analysis_language DEFAULT 'english',
    risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level risk_level,
    verdict TEXT,
    threats JSONB,
    recommendations JSONB,
    sender_analysis JSONB,
    content_analysis JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_preferences table
CREATE TABLE public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    default_language analysis_language DEFAULT 'english',
    theme TEXT DEFAULT 'system',
    email_notifications BOOLEAN DEFAULT true,
    auto_delete_history BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user info
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for analyses
CREATE POLICY "Users can view their own analyses"
ON public.analyses FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analyses"
ON public.analyses FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses"
ON public.analyses FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses"
ON public.analyses FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view their own preferences"
ON public.user_preferences FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences"
ON public.user_preferences FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
ON public.user_preferences FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_analyses_updated_at
    BEFORE UPDATE ON public.analyses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-create profile and preferences on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create screenshots storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('screenshots', 'screenshots', false);

-- Storage policies for screenshots
CREATE POLICY "Users can upload their own screenshots"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own screenshots"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own screenshots"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);