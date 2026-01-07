import { TrendingUp, AlertTriangle, Users, IndianRupee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

const globalTrendData = [
  { year: '2020', loss: 5.2 },
  { year: '2021', loss: 7.8 },
  { year: '2022', loss: 8.9 },
  { year: '2023', loss: 10.2 },
];

const victimDistribution = [
  { name: 'Rural Victims', value: 67, color: 'hsl(var(--destructive))' },
  { name: 'Urban Victims', value: 33, color: 'hsl(var(--primary))' },
];

const sectorData = [
  { sector: 'Banking', percentage: 43 },
  { sector: 'Govt Schemes', percentage: 28 },
  { sector: 'E-commerce', percentage: 18 },
  { sector: 'Others', percentage: 11 },
];

const globalStats = [
  { label: "Lost to SMS Fraud Globally", value: "$10.2B", subtext: "in 2023 (↑15% from 2022)", icon: IndianRupee },
  { label: "Smishing Attempts", value: "3.4B", subtext: "messages worldwide", icon: AlertTriangle },
  { label: "Users Affected", value: "1 in 3", subtext: "received smishing in 2023", icon: Users },
  { label: "Year-over-Year Growth", value: "+68%", subtext: "AI-powered scams", icon: TrendingUp },
];

const indiaStats = [
  { label: "Lost to SMS Fraud in India", value: "₹1,247 Cr", subtext: "in 2023", icon: IndianRupee },
  { label: "Attack Growth Rate", value: "+89%", subtext: "compared to 2022", icon: TrendingUp },
  { label: "Rural Victims", value: "67%", subtext: "of total affected (2.3x urban)", icon: Users },
  { label: "Unreported Cases", value: "78%", subtext: "due to shame/lack of awareness", icon: AlertTriangle },
];

const victimStories = [
  {
    quote: "I lost my entire savings of ₹47,000 to a fake bank message. It looked exactly like my bank's SMS. Now I verify everything twice.",
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
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
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
            
            {/* Global Trend Chart */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-muted-foreground mb-4">Global SMS Fraud Losses ($ Billion)</p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={globalTrendData}>
                      <XAxis dataKey="year" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="loss" 
                        stroke="hsl(var(--destructive))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* India Stats */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center text-sm">🇮🇳</span>
              Impact in India
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
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

            {/* Charts Row */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Pie Chart - Rural vs Urban */}
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Rural vs Urban Victims</p>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={victimDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={55}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${value}%`}
                        >
                          {victimDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-destructive" />
                      <span className="text-xs text-muted-foreground">Rural 67%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-xs text-muted-foreground">Urban 33%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bar Chart - Sectors */}
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Targeted Sectors</p>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sectorData} layout="vertical">
                        <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                        <YAxis type="category" dataKey="sector" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} width={70} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="percentage" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Victim Impact */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold text-foreground mb-8 text-center">
            Real Impact on Real People
          </h3>
          
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-destructive/5 border-destructive/20 text-center p-6">
              <p className="text-3xl font-bold text-destructive">₹47,000</p>
              <p className="text-sm text-muted-foreground">Average rural victim loss</p>
            </Card>
            <Card className="bg-warning/5 border-warning/20 text-center p-6">
              <p className="text-3xl font-bold text-warning">62%</p>
              <p className="text-sm text-muted-foreground">Experience emotional trauma</p>
            </Card>
            <Card className="bg-muted text-center p-6">
              <p className="text-3xl font-bold text-foreground">31%</p>
              <p className="text-sm text-muted-foreground">Lose 3+ months income</p>
            </Card>
            <Card className="bg-primary/5 border-primary/20 text-center p-6">
              <p className="text-3xl font-bold text-primary">87%</p>
              <p className="text-sm text-muted-foreground">Preventable with awareness</p>
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
