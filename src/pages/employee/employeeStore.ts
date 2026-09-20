import { useEffect, useState } from "react";

export type EmployeeStatus = "assigned" | "started" | "travelling" | "arrived" | "picked_up" | "delivery_started" | "delivered" | "completed" | "issue" | "cancelled";
export interface EmployeeJob {
  id: string;
  food: string;
  category: string;
  quantity: number;
  servings: number;
  donor: string;
  donorType: string;
  pickup: string;
  destination: string;
  window: string;
  distance: number;
  priority: "high" | "medium" | "normal";
  status: EmployeeStatus;
  employee: string;
  createdAt: string;
  notes: string;
}

const seedJobs: EmployeeJob[] = [
  { id: "DON-1048", food: "Prepared meals", category: "Cooked meal", quantity: 25, servings: 100, donor: "Grand Hotel Kitchen", donorType: "Business", pickup: "123 Main Street, Downtown", destination: "Hope Community Kitchen", window: "6:00 PM - 7:00 PM", distance: 3.2, priority: "high", status: "assigned", employee: "Alex Morgan", createdAt: "2026-09-06T12:00:00.000Z", notes: "Use loading dock B. Food is sealed and refrigerated." },
  { id: "DON-1049", food: "Fresh produce boxes", category: "Fresh produce", quantity: 18, servings: 72, donor: "Green Leaf Restaurant", donorType: "Business", pickup: "789 Elm Boulevard, Eastside", destination: "Northside Shelter", window: "7:00 PM - 8:00 PM", distance: 5.8, priority: "medium", status: "assigned", employee: "Alex Morgan", createdAt: "2026-09-06T11:15:00.000Z", notes: "Ask for the kitchen manager at the rear entrance." },
  { id: "DON-1050", food: "Bakery assortment", category: "Bakery", quantity: 9, servings: 40, donor: "Sunrise Bakery", donorType: "Business", pickup: "42 Cedar Lane, Midtown", destination: "Community Pantry", window: "8:00 PM - 9:00 PM", distance: 2.4, priority: "normal", status: "assigned", employee: "Unassigned", createdAt: "2026-09-06T10:30:00.000Z", notes: "Keep bags upright during transport." },
];

const key = "foodflow_employee_jobs";

export function useEmployeeJobs() {
  const [jobs, setJobs] = useState<EmployeeJob[]>(() => {
    try { return JSON.parse(localStorage.getItem(key) || "null") || seedJobs; } catch { return seedJobs; }
  });
  useEffect(() => localStorage.setItem(key, JSON.stringify(jobs)), [jobs]);
  const updateJob = (id: string, patch: Partial<EmployeeJob>) => setJobs((current) => current.map((job) => job.id === id ? { ...job, ...patch } : job));
  const acceptJob = (id: string) => updateJob(id, { status: "assigned", employee: "You" });
  return { jobs, updateJob, acceptJob };
}

export function useEmployeePreferences() {
  const [preferences, setPreferences] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem("foodflow_employee_preferences") || "{}"); } catch { return {}; }
  });
  useEffect(() => localStorage.setItem("foodflow_employee_preferences", JSON.stringify(preferences)), [preferences]);
  return { preferences, setPreference: (key: string, value: boolean) => setPreferences((current) => ({ ...current, [key]: value })) };
}