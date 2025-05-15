"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Image from "next/image";

function CardOption({
  image,
  label,
  selected,
  onClick,
}: {
  image: string;
  label: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center border rounded-lg p-2 w-1/2 cursor-pointer ${
        selected ? "border-[#328E6E] bg-green-50" : "hover:border-[#328E6E]"
      }`}
    >
      <Image src={image} alt={label} width={100} height={100} className="rounded-md" />
      <span className="mt-2 font-medium">{label}</span>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [checked, setChecked] = useState<{ [key: number]: boolean[] }>({});
  const [plantName, setPlantName] = useState("");
  const [selectedVariety, setSelectedVariety] = useState<string | null>(null);

  const next = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const stepImages: { [key: number]: string } = {
    1: "/assets/images/logo8.svg",
    2: "/assets/images/logo10.svg",
    3: "/assets/images/logo11.svg",
    4: "/assets/images/logo14.svg",
  };

  const stepInfos: { [key: number]: string } = {
    0: "Choose a Mustard Green Variety",
    1: "Prepare Tools and Materials",
    2: "Prepare Planting Media",
    3: "Give your plant a name",
    4: "You're Done!",
  };

  const steps = [
    {
      content: (
        <div className="flex gap-4 mt-11">
          <CardOption
            image="/assets/images/logo10.svg"
            label="Sawi Hijau"
            selected={selectedVariety === "Sawi Hijau"}
            onClick={() => setSelectedVariety("Sawi Hijau")}
          />
          <CardOption
            image="/assets/images/logo11.svg"
            label="Sawi Putih"
            selected={selectedVariety === "Sawi Putih"}
            onClick={() => setSelectedVariety("Sawi Putih")}
          />
        </div>
      ),
    },
    {
      content: <CheckboxList step={1} checked={checked} setChecked={setChecked} />,
    },
    {
      content: (
        <CheckboxList
          step={2}
          checked={checked}
          setChecked={setChecked}
          items={["Fertilizer ratio: 1:2", "Mix using MSG"]}
        />
      ),
    },
    {
      content: (
        <div className="flex flex-col gap-1 mt-4">
          <label className="text-sm font-semibold text-gray-700">Plant Name</label>
          <Input
            placeholder="Sawi Name"
            value={plantName}
            onChange={(e) => setPlantName(e.target.value)}
            className="font-semibold text-black border-[#328E6E] focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      ),
    },
    {
      success: true,
    },
  ];

  const step = steps[currentStep];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-[393px] h-[852px] relative">
      <div className="flex-1 overflow-y-auto p-6 pb-40">
        {/* Header */}
        <div className="relative flex items-center justify-center mb-4">
          <button
            onClick={() => router.push("/main/dashboard-temp")}
            className="absolute left-0 text-[#328E6E] text-2xl font-bold cursor-pointer"
          >
            &lt;
          </button>
          <span className="text-sm text-black font-medium text-center">
            {stepInfos[currentStep]}
          </span>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full transition-all"
            style={{
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
              backgroundColor: "#328E6E",
            }}
          />
        </div>

        {step?.title && <h1 className="text-center text-xl font-bold mt-6">{step?.title}</h1>}

        {currentStep > 0 && currentStep <= 4 && (
          <div className="flex flex-col items-center my-2">
            {currentStep === 4 && (
              <div className="text-center font-semibold text-sm text-[#328E6E] mb-2">
                Yay! You've successfully planted!
              </div>
            )}
            <Image
              src={stepImages[currentStep] || "/assets/images/logo12.svg"}
              alt={`Step ${currentStep} Illustration`}
              width={180}
              height={180}
            />
          </div>
        )}

        <div className="space-y-4 mt-4">{step.content}</div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-4 pb-4 space-y-2 max-w-md mx-auto">
        <button
          onClick={currentStep < steps.length - 1 ? next : () => setCurrentStep(0)}
          className="w-full bg-[#328E6E] hover:bg-[#28735a] text-white py-3 rounded-md font-medium text-sm"
        >
          {currentStep === 3
            ? "Plant Now"
            : currentStep < steps.length - 1
            ? "Next"
            : "Back to Home"}
        </button>

        {currentStep !== 0 && currentStep !== 4 && (
          <button
            onClick={prev}
            className="w-full text-sm font-medium py-2 text-gray-500 hover:text-gray-600"
          >
            Previous
          </button>
        )}
      </div>
    </div>
  );
}

function CheckboxList({
  step,
  checked,
  setChecked,
  items = ["Prepare the polybag", "Prepare the fertilizer", "Watering tool"],
}: {
  step: number;
  checked: { [key: number]: boolean[] };
  setChecked: React.Dispatch<React.SetStateAction<{ [key: number]: boolean[] }>>;
  items?: string[];
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <label
          key={i}
          className={`flex items-center gap-3 justify-between ${
            step === 1 || step === 2 ? "flex-row-reverse" : ""
          }`}
        >
          <Checkbox
            checked={checked[step]?.[i] || false}
            onCheckedChange={(val) => {
              const updatedChecks = [...(checked[step] || [])];
              updatedChecks[i] = !!val;
              setChecked((prev) => ({
                ...prev,
                [step]: updatedChecks,
              }));
            }}
            className="data-[state=checked]:bg-[#328E6E] data-[state=checked]:border-[#328E6E]"
          />
          <span>{item}</span>
        </label>
      ))}
    </div>
  );
}
