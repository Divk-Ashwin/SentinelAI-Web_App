import { TrendingUp, AlertTriangle, Users, IndianRupee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const globalStats = [
  { label: "Lost to SMS Fraud Globally", value: "$10.5B", subtext: "in 2024", icon: IndianRupee },
  { label: "Smishing Attempts", value: "3.4B", subtext: "per year worldwide", icon: AlertTriangle },
  { label: "Users Affected", value: "68%", subtext: "received smishing messages", icon: Users },
  { label: "Year-over-Year Growth", value: "+287%", subtext: "since 2020", icon: TrendingUp },
];

const indiaStats = [
  { label: "Lost to SMS Fraud in India", value: "₹1,750 Cr", subtext: "in 2024", icon: IndianRupee },
  { label: "Growth Rate", value: "+340%", subtext: "increase in smishing", icon: TrendingUp },
  { label: "Rural Victims", value: "62%", subtext: "of total affected", icon: Users },
  { label: "Unreported Cases", value: "78%", subtext: "due to shame/fear", icon: AlertTriangle },
];

const victimStories = [
  {
    quote: "I lost my entire savings to a fake bank message. It looked exactly like my bank's SMS. Now I verify everything twice.",
    location: "Anonymous, Telangana",
  },
  {
    quote: "The shame of falling for a scam kept me from warning others. Not anymore. I want everyone to know these tricks.",
    location: "Rural Victim, Maharashtra",
  },
  {
    quote: "My elderly father clicked a fake KYC link. Within minutes, ₹85,000 was gone. We need better protection.",
    location: "Anonymous, Karnataka",
  },
];

export function StatisticsSection() {
  return (
    <section id="statistics" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            The Smishing Crisis
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Why SMS fraud detection is critical in India
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Global Stats */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">🌍</span>
              Global Impact
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {globalStats.map((stat) => (
                <Card key={stat.label} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <stat.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* India Stats */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center text-sm">🇮🇳</span>
              Impact in India
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {indiaStats.map((stat) => (
                <Card key={stat.label} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                        <stat.icon className="h-5 w-5 text-warning" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Victim Impact */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold text-foreground mb-8 text-center">
            Real Impact on Real People
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-destructive/5 border-destructive/20 text-center p-6">
              <p className="text-3xl font-bold text-destructive">₹45,000</p>
              <p className="text-sm text-muted-foreground">Average loss per victim</p>
            </Card>
            <Card className="bg-warning/5 border-warning/20 text-center p-6">
              <p className="text-3xl font-bold text-warning">67%</p>
              <p className="text-sm text-muted-foreground">Experience emotional trauma</p>
            </Card>
            <Card className="bg-muted text-center p-6">
              <p className="text-3xl font-bold text-foreground">43%</p>
              <p className="text-sm text-muted-foreground">Don't report due to shame</p>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {victimStories.map((story, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">{story.location}</p>
                  </div>
                  <p className="text-foreground italic">"{story.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
