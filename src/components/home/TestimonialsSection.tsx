import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Priya S.",
    location: "Hyderabad",
    rating: 5,
    text: "This app saved me from losing ₹50,000 to a fake UPI message. The analysis was instant and detailed! I share it with everyone now.",
  },
  {
    name: "Rajesh K.",
    location: "Mumbai",
    rating: 5,
    text: "I received a suspicious Aadhaar update message. The AI detected it was a scam before I clicked anything. Very impressed!",
  },
  {
    name: "Anonymous",
    location: "Rural Karnataka",
    rating: 5,
    text: "As a senior citizen, I struggle to identify fake messages. This tool gives me confidence and peace of mind. Thank you!",
  },
  {
    name: "Meera D.",
    location: "Chennai",
    rating: 5,
    text: "The detailed breakdown of why a message is suspicious really helped me understand the red flags. Educational and protective!",
  },
];

const stats = [
  { value: "10,000+", label: "Messages Analyzed" },
  { value: "98%", label: "Detection Accuracy" },
  { value: "50+", label: "Cities Protected" },
  { value: "₹2.5Cr", label: "Fraud Prevented" },
];

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real stories from users we've helped protect
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-primary/20 mb-2" />
                <p className="text-foreground text-sm mb-4 line-clamp-4">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {testimonial.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-gradient-primary rounded-2xl">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary-foreground">{stat.value}</p>
              <p className="text-sm text-primary-foreground/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
