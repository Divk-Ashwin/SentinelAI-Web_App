import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";

const sectorData = [
  { sector: "Banking & Finance", percentage: 43 },
  { sector: "E-commerce & Delivery", percentage: 28 },
  { sector: "Government Schemes", percentage: 18 },
  { sector: "Lottery & Prizes", percentage: 11 },
];

const stats = [
  { value: "₹1,247 Cr", label: "Lost to SMS fraud in India (2023)" },
  { value: "67%", label: "Of victims live in rural areas" },
  { value: "78%", label: "Don't know how to spot scams" },
];

export function StatisticsSection() {
  return (
    <section id="statistics" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            The Problem Is Real
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-card border-border text-center">
              <CardContent className="pt-6">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          We're here to change this. One message at a time.
        </p>

        {/* Horizontal Bar Chart */}
        <Card className="bg-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold">
              Top Scam Targets in India (2023)
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Percentage of total smishing attacks by sector
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full" role="img" aria-label="Bar chart showing percentage of smishing attacks by sector">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={sectorData}
                  margin={{ top: 10, right: 50, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={true} vertical={false} />
                  <XAxis
                    type="number"
                    domain={[0, 50]}
                    tickFormatter={(value) => `${value}%`}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="sector"
                    width={150}
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 13 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, 'Percentage']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px hsl(var(--foreground) / 0.08)',
                    }}
                    labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                    itemStyle={{ color: 'hsl(var(--muted-foreground))' }}
                    cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                  />
                  <Bar
                    dataKey="percentage"
                    fill="hsl(var(--primary))"
                    radius={[0, 8, 8, 0]}
                    barSize={32}
                  >
                    <LabelList
                      dataKey="percentage"
                      position="right"
                      formatter={(value: number) => `${value}%`}
                      style={{ fill: 'hsl(var(--foreground))', fontWeight: 600, fontSize: 13 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
