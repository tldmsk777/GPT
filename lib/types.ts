export type Gender = "남" | "여" | "기타" | "응답 안 함";

export interface BirthInput {
  birthDate: string;
  birthTime?: string;
  unknownBirthTime: boolean;
  gender: Gender;
  calendarType: "양력" | "음력";
  leapMonth: boolean;
  birthPlace?: string;
  nickname?: string;
}

export interface SajuResponse {
  profile: {
    inputSummary: string;
    disclaimer: string;
  };
  saju: {
    fourPillars: {
      year: { heavenlyStem: string; earthlyBranch: string; ganji: string };
      month: { heavenlyStem: string; earthlyBranch: string; ganji: string };
      day: { heavenlyStem: string; earthlyBranch: string; ganji: string };
      hour: {
        heavenlyStem: string;
        earthlyBranch: string;
        ganji: string;
        unknown: boolean;
      };
    };
    fiveElements: {
      wood: number;
      fire: number;
      earth: number;
      metal: number;
      water: number;
      notes: string;
    };
  };
  reading: {
    coreTraits: string[];
    strengths: string[];
    growthEdges: string[];
    relationships: string[];
    careerStudy: string[];
    money: string[];
    health: string[];
    oneLineAdvice: string;
  };
}

export interface DailyResponse {
  date: string;
  disclaimer: string;
  scores: {
    overall: number;
    love: number;
    work: number;
    money: number;
    health: number;
  };
  today: {
    summary: string;
    do: string[];
    avoid: string[];
    lucky: {
      color: string;
      number: string;
      item: string;
      timeRange: string;
    };
  };
}
