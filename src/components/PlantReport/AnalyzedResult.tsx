"use client";
import { mapPlantCondition } from "@/lib/site";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { Card, CardContent } from "../ui/card";

interface AnalyzedResultProps {
  analyzedReport: { grade: string; additionalNotes: string; recommendedActions: string };
}
export default function AnalyzedResult({ analyzedReport }: AnalyzedResultProps) {
  const { plantId } = useParams();
  const [expandedSections, setExpandedSections] = React.useState({
    additionalNotes: true,
    recommendedActions: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderMarkdownContent = (text: string) => {
    if (!text) return null;

    return text.split("\n").map((line, i) => {
      if (line.trim().startsWith("*")) {
        const content = line.replace(/^\*\s*/, "").trim();
        const parts = content.split("**");
        const boldElements = parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        );

        return (
          <div key={i} style={{ display: "flex", marginBottom: 4 }}>
            <span style={{ marginRight: 8 }}>•</span>
            <div>{boldElements}</div>
          </div>
        );
      }
      return (
        <div key={i} style={{ marginBottom: 8 }}>
          {line}
        </div>
      );
    });
  };

  return (
    <>
      <Card className='w-full max-w-sm h-[70px] border border-[#a8ddd1] bg-[#e3f6f1] rounded-xl shadow-sm mt-5 mb-4'>
        <CardContent className='flex items-center h-full px-4 py-2 gap-3'>
          <div className='w-8 h-8 rounded-full bg-[#328e6e] flex items-center justify-center text-white font-bold text-sm'>
            {analyzedReport.grade}
          </div>
          <div className='flex flex-col'>
            <p className='text-[12px] text-gray-600 font-medium leading-tight'>
              Your Plant Condition’s {mapPlantCondition(analyzedReport.grade)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <div
        style={{
          width: 340,
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 2px 8px #0001",
          marginBottom: 18,
          fontFamily: "Nunito",
        }}>
        <div
          style={{
            padding: "14px 20px",
            borderBottom: expandedSections.additionalNotes ? "1px solid #eee" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            fontFamily: "Nunito",
          }}
          onClick={() => toggleSection("additionalNotes")}>
          <span style={{ fontWeight: 500 }}>Additional Notes</span>
          <span
            style={{
              fontSize: 22,
              color: "#7A7A7A",
              transform: expandedSections.additionalNotes ? "rotate(0deg)" : "rotate(-90deg)",
              transition: "transform 0.2s ease",
            }}>
            ▼
          </span>
        </div>
        <div
          style={{
            maxHeight: expandedSections.additionalNotes ? "1000px" : "0",
            overflow: "hidden",
            transition: "max-height 0.3s ease, padding 0.3s ease",
            padding: expandedSections.additionalNotes ? "14px 20px" : "0 20px",
            fontSize: 14,
            color: "#444",
          }}>
          {renderMarkdownContent(analyzedReport.additionalNotes ?? "")}
        </div>
      </div>

      {/* Recommended Actions */}
      <div
        style={{
          width: 340,
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 2px 8px #0001",
          marginBottom: 32,
          fontFamily: "Nunito",
        }}>
        <div
          style={{
            padding: "14px 20px",
            borderBottom: expandedSections.recommendedActions ? "1px solid #eee" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            fontFamily: "Nunito",
          }}
          onClick={() => toggleSection("recommendedActions")}>
          <span style={{ fontWeight: 500 }}>Recommended Actions</span>
          <span
            style={{
              fontSize: 22,
              color: "#7A7A7A",
              transform: expandedSections.recommendedActions ? "rotate(0deg)" : "rotate(-90deg)",
              transition: "transform 0.2s ease",
            }}>
            ▼
          </span>
        </div>
        <div
          style={{
            maxHeight: expandedSections.recommendedActions ? "1000px" : "0",
            overflow: "hidden",
            transition: "max-height 0.3s ease, padding 0.3s ease",
            padding: expandedSections.recommendedActions ? "14px 20px" : "0 20px",
            fontSize: 14,
            color: "#444",
          }}>
          {renderMarkdownContent(analyzedReport.recommendedActions ?? "")}
        </div>
      </div>
    </>
  );
}
