import { unit01 } from "@/content/units/unit-01";
import { HomeDashboard } from "@/features/learning/home-dashboard";

export default function Home() {
  return (
    <HomeDashboard
      unit={{
        title: unit01.title.en,
        descriptionVi: unit01.descriptionVi,
        level: unit01.level,
        rewards: unit01.rewards,
      }}
    />
  );
}
