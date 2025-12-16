import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { motion } from "framer-motion";
import { MapPin, Briefcase } from "lucide-react";

const BRAZIL_TOPO_JSON = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

const cities = [
  { name: "São Paulo", coordinates: [-46.6333, -23.5505], jobs: 1247 },
  { name: "Rio de Janeiro", coordinates: [-43.1729, -22.9068], jobs: 876 },
  { name: "Belo Horizonte", coordinates: [-43.9378, -19.9167], jobs: 634 },
  { name: "Brasília", coordinates: [-47.9292, -15.7801], jobs: 523 },
  { name: "Salvador", coordinates: [-38.5014, -12.9714], jobs: 456 },
  { name: "Curitiba", coordinates: [-49.2654, -25.4284], jobs: 398 },
  { name: "Fortaleza", coordinates: [-38.5434, -3.7172], jobs: 342 },
  { name: "Porto Alegre", coordinates: [-51.2177, -30.0346], jobs: 312 },
  { name: "Recife", coordinates: [-34.8811, -8.0476], jobs: 289 },
];

export function BrazilMap() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 800,
          center: [-54, -15],
        }}
        className="w-full h-full"
      >
        <Geographies geography={BRAZIL_TOPO_JSON}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="hsl(var(--primary) / 0.15)"
                stroke="hsl(var(--primary) / 0.4)"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "hsl(var(--primary) / 0.25)", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {cities.map((city) => (
          <Marker
            key={city.name}
            coordinates={city.coordinates as [number, number]}
            onMouseEnter={() => setHoveredCity(city.name)}
            onMouseLeave={() => setHoveredCity(null)}
          >
            <circle
              r={hoveredCity === city.name ? 8 : 6}
              fill="hsl(var(--primary))"
              className="cursor-pointer transition-all duration-200"
              style={{
                filter: "drop-shadow(0 0 8px hsl(var(--primary) / 0.6))",
              }}
            />
            <circle
              r={12}
              fill="hsl(var(--primary) / 0.3)"
              className="animate-ping"
            />
          </Marker>
        ))}
      </ComposableMap>

      {/* City Cards Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {cities.map((city, i) => {
          // Position cards based on city location
          const positions: Record<string, { top: string; left: string }> = {
            "São Paulo": { top: "62%", left: "58%" },
            "Rio de Janeiro": { top: "58%", left: "68%" },
            "Belo Horizonte": { top: "48%", left: "62%" },
            "Brasília": { top: "42%", left: "52%" },
            "Salvador": { top: "35%", left: "75%" },
            "Curitiba": { top: "72%", left: "52%" },
            "Fortaleza": { top: "18%", left: "78%" },
            "Porto Alegre": { top: "82%", left: "48%" },
            "Recife": { top: "25%", left: "82%" },
          };
          
          const pos = positions[city.name] || { top: "50%", left: "50%" };
          
          return (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + 0.1 * i, type: "spring" }}
              className="absolute pointer-events-auto cursor-pointer group"
              style={{ top: pos.top, left: pos.left }}
            >
              <div className="bg-background/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-xl border border-primary/20 transform -translate-x-1/2 group-hover:scale-110 transition-transform">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-primary" />
                  <span className="font-semibold text-xs">{city.name}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Briefcase className="h-2.5 w-2.5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">{city.jobs} vagas</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
