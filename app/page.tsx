"use client";

import type React from "react";

import { useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { format } from "date-fns";
import dayjs from 'dayjs'
import { ptBR } from "date-fns/locale";
import Cookies from "js-cookie";
// Hero Icons imports
import {
  ChatBubbleLeftRightIcon as MessageSquareIcon,
  MicrophoneIcon as MicIcon,
  TrophyIcon as AwardIcon,
  BookOpenIcon,
  StarIcon,
  ClockIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { useUser } from "@/main/UserContext/UserContext";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/infrastructure/dashboard-infra";

export type ChartYearEntry = {
  date: string;
  count: number;
  month: string;
};

const getColorClass = (count: number | null) => {
  if (count === null || count === 0) return "bg-gray-100";
  if (count === 1) return "bg-blue-200";
  if (count === 2) return "bg-blue-400";
  if (count === 3) return "bg-blue-600";
  return "bg-blue-800";
};

const months = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export default function Home() {
  const router = useRouter();
  const token = Cookies.get("speech-ease-auth");

  const { data: user } = useQuery({
    queryKey: ["me"],
    enabled: !!token,
    queryFn: () => dashboardService.me(token as string),
  });

  const chartYear: ChartYearEntry[] =
    user?.body?.data?.customerActivitie.at(0).chartYear || [];
  const minutesToday =
    user?.body?.data?.customerActivitie.at(0).dailyGoalProgress || 0;
  const totalXp = user?.body?.data?.customerActivitie.at(0).xp || 0;
  const streak = user?.body?.data?.customerActivitie.at(0).dayStreak || 0;
  const bestStreak = user?.body?.data?.customerActivitie.at(0).bestStreak || 0;

  const daysPracticed =
    user?.body?.data?.customerActivitie.at(0).chartWeek.length || 0;

  const totalActivitiesYear = useMemo(() => {
    return chartYear.reduce((total, day) => total + (day.count || 0), 0);
  }, [chartYear]);

  const currentYear = "2025";

  const generateMonthCells = (monthStr: string) => {
    const [year, month] = monthStr.split("-").map(Number);

    const daysInMonth = new Date(year, month, 0).getDate();

    const cells = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDay = day.toString().padStart(2, "0");
      const dateStr = `${year}-${month
        .toString()
        .padStart(2, "0")}-${formattedDay}`;

      const dayData = chartYear.find((entry) => entry.date === dateStr);

      cells.push(
        <div
          key={dateStr}
          className={`w-3 h-3 gap-5 rounded-sm ${getColorClass(
            dayData?.count || 0
          )}`}
          title={`${dayjs(dateStr).endOf("day").format("D [de] MMMM")}: ${dayData ? dayData.count : 0} atividades`}
        />
      );
    }

    return cells;
  };

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 tracking-tight">
            Welcome back!
          </h1>
          <p className="text-muted-foreground">
            Continue your English learning journey
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            <StarIcon className="h-4 w-4" />
            <span>Level: Intermediate</span>
          </div>
          <div className="bg-amber-500/10 text-amber-500 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            <AwardIcon className="h-4 w-4" />
            <span>{totalXp} XP</span>
          </div> */}
          {/* <div className="bg-green-500/10 text-green-500 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>{streak} Day Streak</span>
          </div> */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 md:col-span-2 overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/5">
          <div className="bg-gradient-to-r from-primary/20 to-transparent p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="relative w-32 h-32 flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round((daysPracticed / 7) * 100)}%
                  </div>
                </div>
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted/30"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray="352"
                    strokeDashoffset={352 * (1 - daysPracticed / 7)}
                    className="text-primary"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Weekly Goal</h3>
                <p className="text-muted-foreground mb-4">
                  You're making great progress! Keep going to reach your weekly
                  goal.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-card/50 backdrop-blur-sm p-3 rounded-lg">
                    <div className="text-2xl font-bold">{daysPracticed}/7</div>
                    <div className="text-sm text-muted-foreground">
                      Days practiced
                    </div>
                  </div>
                  {/* <div className="bg-card/50 backdrop-blur-sm p-3 rounded-lg">
                    <div className="text-2xl font-bold">{minutesToday}</div>
                    <div className="text-sm text-muted-foreground">
                      Minutes today
                    </div>
                  </div> */}
                  {/* <div className="bg-card/50 backdrop-blur-sm p-3 rounded-lg">
                    <div className="text-2xl font-bold">{totalXp}</div>
                    <div className="text-sm text-muted-foreground">
                      Total XP
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden border-2 border-blue-200 shadow-lg hover:border-blue-300 transition-all">
          <CardHeader className="pb-2 bg-gradient-to-b from-secondary/20 to-transparent">
            <CardTitle className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {/* {[
                {
                  title: "Completed Business English lesson",
                  time: "2 hours ago",
                  icon: <BookOpenIcon className="h-4 w-4" />,
                },
                {
                  title: "Chat session with GUGA",
                  time: "Yesterday",
                  icon: <MessageSquareIcon className="h-4 w-4" />,
                },
                {
                  title: "Read Aloud practice",
                  time: "2 days ago",
                  icon: <MicIcon className="h-4 w-4" />,
                },
              ].map((item, i) => (
                <li
                  key={i}
                  className="p-4 hover:bg-secondary/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-secondary/20 p-2 rounded-full">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.time}
                      </p>
                    </div>
                  </div>
                </li>
              ))} */}
              <li className="p-4 text-center text-muted-foreground">
                Available soon
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 tracking-tight">
        <span className="inline-block w-2 h-6 bg-primary rounded-full mr-1"></span>
        Continue where you left off
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
        <FeatureCard
          href="/read-aloud"
          icon={<MicIcon className="h-10 w-10 text-primary" />}
          title="Read Aloud"
          description="Practice your pronunciation"
          progress={42}
          badge="Featured"
        />
      </div>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 tracking-tight">
        <span className="inline-block w-2 h-6 bg-primary rounded-full mr-1"></span>
        Your activity history
      </h2>

      <Card className="mb-8 border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Activity Chart
          </CardTitle>
          <CardDescription>
            Your progress throughout the year. The greener, the more activities
            you completed.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">
                Activities in {currentYear}
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
                  <div className="w-3 h-3 rounded-sm bg-blue-200"></div>
                  <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
                  <div className="w-3 h-3 rounded-sm bg-blue-600"></div>
                  <div className="w-3 h-3 rounded-sm bg-blue-800"></div>
                </div>
                <span>More</span>
              </div>
            </div>

            <div className="p-4 sm:p-6 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-base sm:text-lg">
                  Annual Activity Chart
                </h3>
                <select className="border rounded p-1 text-xs sm:text-sm">
                  <option>{currentYear}</option>
                </select>
              </div>

              <div className="grid grid-cols-12 gap-2 sm:gap-4">
                {months.map((month, index) => (
                  <div key={month} className="grid grid-cols-7 gap-1">
                    {generateMonthCells(
                      `${currentYear}-${(index + 1)
                        .toString()
                        .padStart(2, "0")}`
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-12 mt-4 text-[10px] sm:text-xs text-slate-600">
                {months.map((month) => (
                  <div key={month} className="col-span-1 flex justify-center">
                    {month}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-card/50 backdrop-blur-sm p-3 rounded-lg">
              <div className="font-medium text-muted-foreground">
                Total activities:
              </div>
              <div className="font-bold text-primary text-xl">
                {totalActivitiesYear}
              </div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm p-3 rounded-lg">
              {/* <div className="font-medium text-muted-foreground">
                Current streak:
              </div>
              <div className="font-bold text-primary text-xl">
                {streak} days
              </div> */}
              </div>
              <div className="bg-card/50 backdrop-blur-sm p-3 rounded-lg">
              {/* <div className="font-medium text-muted-foreground">
                Best streak:
              </div>
              <div className="font-bold text-primary text-xl">
                {bestStreak} days
              </div> */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface FeatureCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  progress: number;
  badge?: string;
}

function FeatureCard({
  href,
  icon,
  title,
  description,
  progress,
  badge,
}: FeatureCardProps) {
  return (
    <Link
      href={
        title === "Chat with GUGA"
          ? "/chat/select"
          : title === "Read Aloud"
          ? "/read-aloud/cards"
          : href
      }
    >
      <div className="p-4 border border-blue-100 rounded-lg transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-md">
        <div className="flex justify-between items-start pb-2">
          <div>{icon}</div>
          <div className="flex items-center gap-2">
            {badge && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                {badge}
              </span>
            )}
          </div>
        </div>
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
        <div className="flex justify-end mt-4">
          <span className="text-sm font-medium text-blue-600 hover:underline">
            Continue
          </span>
        </div>
      </div>
    </Link>
  );
}
