import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useController, type Control, FormProvider } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  pronounOptions,
  howWeMetOptions,
  relationshipGoalOptions,
  workIndustryOptions,
  spiritualBeliefsOptions,
  communicationStyleOptions,
  coreValueOptions,
  ethnicityOptions,
} from "@/data/formOptions";
import { clientService } from "@/services/clientService";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// Zod schema for form validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  pronouns: z.string().optional(),
  howWeMet: z.string().optional(),
  birthDay: z.string().optional(),
  ethnicity: z.string().optional(),
  currentVibe: z.string().optional(),
  relationshipGoal: z.string().optional(),
  workIndustry: z.string().optional(),
  spiritualBeliefs: z.string().optional(),
  communicationStyle: z.string().optional(),
  coreValue: z.string().optional(),
  mbtiType: z.string().optional(),
  mbtiIe: z.number().min(0).max(100).optional(),
  mbtiNs: z.number().min(0).max(100).optional(),
  mbtiFt: z.number().min(0).max(100).optional(),
  mbtiJp: z.number().min(0).max(100).optional(),
  attachmentAnxiety: z.number().min(-5).max(5).optional(),
  attachmentAvoidance: z.number().min(-5).max(5).optional(),
  abilityIntuition: z.number().min(0).max(10).optional(),
  abilityEmpathy: z.number().min(0).max(10).optional(),
  abilityAmbition: z.number().min(0).max(10).optional(),
  abilityIntellect: z.number().min(0).max(10).optional(),
  abilityCreativity: z.number().min(0).max(10).optional(),
  abilitySelfAwareness: z.number().min(0).max(10).optional(),
  readerNotes: z.string().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

// Reusable Slider Field Component using native range input
const SliderField = ({
  control,
  name,
  label,
  min,
  max,
  step,
}: {
  control: Control<FormSchemaType>;
  name: keyof FormSchemaType;
  label: string;
  min: number;
  max: number;
  step: number;
}) => {
  const { field } = useController({ name, control });
  const value = field.value as number ?? (min + max) / 2;

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium leading-none">{label}</Label>
      <div className="flex items-center gap-4">
        <input
          type="range"
          value={value}
          onChange={(e) => field.onChange(parseFloat(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-indigo-600
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:shadow
            [&::-webkit-slider-thumb]:transition
            focus:outline-none
            "
          style={{
            accentColor: "#6366f1", // fallback for non-Tailwind browsers
          }}
        />
        <span className="w-10 text-right font-mono text-gray-700">
          {value}
        </span>
      </div>
    </div>
  );
};

// Reusable Bipolar Slider Field Component using native range input
const BipolarSliderField = ({
  control,
  name,
  label,
  leftLabel,
  rightLabel,
  min = 0,
  max = 100,
}: {
  control: Control<FormSchemaType>;
  name: keyof FormSchemaType;
  label: string;
  leftLabel: string;
  rightLabel: string;
  min?: number;
  max?: number;
}) => {
  const { field } = useController({ name, control });
  const value = field.value as number ?? (min + max) / 2;

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium leading-none">{label}</Label>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 w-4 text-left">{leftLabel}</span>
        <input
          type="range"
          value={value}
          onChange={(e) => field.onChange(parseFloat(e.target.value))}
          min={min}
          max={max}
          step={1}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-indigo-600
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:shadow
            [&::-webkit-slider-thumb]:transition
            focus:outline-none
            "
          style={{
            accentColor: "#6366f1",
          }}
        />
        <span className="text-xs text-gray-400 w-4 text-right">{rightLabel}</span>
      </div>
    </div>
  );
};

// Improved SelectField with Tailwind and placeholder fix
const SelectField = ({
  control,
  name,
  label,
  placeholder,
  options,
}: {
  control: Control<FormSchemaType>;
  name: keyof FormSchemaType;
  label: string;
  placeholder: string;
  options: string[];
}) => {
  const { field } = useController({ name, control });
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium leading-none">{label}</Label>
      <select
        id={name}
        {...field}
        className="block w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition"
        value={field.value ?? ""}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="text-gray-700">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default function NewClientForm() {
  const navigate = useNavigate();
  const [showPersonality, setShowPersonality] = useState(false);
  const [showAbilities, setShowAbilities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      pronouns: "",
      howWeMet: "",
      birthDay: "",
      ethnicity: "",
      currentVibe: "",
      relationshipGoal: "",
      workIndustry: "",
      spiritualBeliefs: "",
      communicationStyle: "",
      coreValue: "",
      mbtiType: "INFP",
      mbtiIe: 50,
      mbtiNs: 50,
      mbtiFt: 50,
      mbtiJp: 50,
      attachmentAnxiety: 0,
      attachmentAvoidance: 0,
      abilityIntuition: 5,
      abilityEmpathy: 5,
      abilityAmbition: 5,
      abilityIntellect: 5,
      abilityCreativity: 5,
      abilitySelfAwareness: 5,
      readerNotes: "",
    },
  });

  const { control, handleSubmit, watch, setValue, getValues } = form;

  const mbtiIe = watch("mbtiIe");
  const mbtiNs = watch("mbtiNs");
  const mbtiFt = watch("mbtiFt");
  const mbtiJp = watch("mbtiJp");

  useEffect(() => {
    let type = "";
    type += (mbtiIe ?? 50) <= 50 ? "I" : "E";
    type += (mbtiNs ?? 50) > 50 ? "N" : "S";
    type += (mbtiFt ?? 50) > 50 ? "F" : "T";
    type += (mbtiJp ?? 50) <= 50 ? "P" : "J";

    if (getValues("mbtiType") !== type) {
      setValue("mbtiType", type, { shouldValidate: true });
    }
  }, [mbtiIe, mbtiNs, mbtiFt, mbtiJp, setValue, getValues]);

  const handleMbtiTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^INFJESTP]/g, "");
    setValue("mbtiType", value);

    if (value.length >= 1) setValue("mbtiIe", value[0] === "I" ? 0 : 100);
    if (value.length >= 2) setValue("mbtiNs", value[1] === "N" ? 100 : 0);
    if (value.length >= 3) setValue("mbtiFt", value[2] === "F" ? 100 : 0);
    if (value.length >= 4) setValue("mbtiJp", value[3] === "P" ? 0 : 100);
  };

  async function onSubmit(values: FormSchemaType) {
    setIsSubmitting(true);
    try {
      const {
        name,
        pronouns,
        howWeMet,
        birthDay,
        ethnicity,
        currentVibe,
        relationshipGoal,
        workIndustry,
        spiritualBeliefs,
        communicationStyle,
        coreValue,
        readerNotes,
      } = values;

      const newClient = await clientService.createClient({
        name,
        pronouns,
        how_we_met: howWeMet,
        birth_day: birthDay,
        ethnicity,
        current_vibe: currentVibe,
        relationship_goal: relationshipGoal,
        work_industry: workIndustry,
        spiritual_beliefs: spiritualBeliefs,
        communication_style: communicationStyle,
        core_value: coreValue,
        reader_notes: readerNotes,
      });

      if (newClient && newClient.id) {
        if (showPersonality) {
          await clientService.updateClientMBTI(newClient.id, {
            mbti_type: values.mbtiType,
            ie_score: values.mbtiIe,
            ns_score: values.mbtiNs,
            ft_score: values.mbtiFt,
            jp_score: values.mbtiJp,
          });
          await clientService.updateClientAttachment(newClient.id, {
            anxiety_score: values.attachmentAnxiety,
            avoidance_score: values.attachmentAvoidance,
          });
        }

        if (showAbilities) {
          await clientService.updateClientAbilities(newClient.id, {
            intuition: values.abilityIntuition,
            empathy: values.abilityEmpathy,
            ambition: values.abilityAmbition,
            intellect: values.abilityIntellect,
            creativity: values.abilityCreativity,
            self_awareness: values.abilitySelfAwareness,
          });
        }
      }

      toast.success("New client created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Failed to create new client:", error);
      toast.error("Failed to create new client.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-8">
  <Card className="max-w-3xl mx-auto overflow-hidden">
        {/* Header */}
        <CardHeader className="flex flex-row items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Add a New Client</h1>
            <p className="text-muted-foreground text-sm">
              Create a new client profile to begin tracking your readings and insights.
            </p>
          </div>
        </CardHeader>

        <CardContent>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Basic Info */}
            <section>
              <h2 className="text-lg font-semibold text-indigo-600 mb-4 border-l-4 border-indigo-600 pl-2 font-brockmann">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name <span className="text-destructive">*</span></Label>
                  <Input
                    {...form.register("name")}
                    id="name"
                    placeholder="e.g., Luna Blackwood"
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <SelectField
                  control={control}
                  name="pronouns"
                  label="Pronouns"
                  placeholder="Select pronouns"
                  options={pronounOptions}
                />
                <div className="space-y-2">
                  <Label htmlFor="birthDay" className="text-sm font-medium">Birthday</Label>
                  <Input
                    type="date"
                    {...form.register("birthDay")}
                    id="birthDay"
                  />
                </div>
                <SelectField
                  control={control}
                  name="ethnicity"
                  label="Ethnicity"
                  placeholder="Select ethnicity"
                  options={ethnicityOptions}
                />
                <SelectField
                  control={control}
                  name="howWeMet"
                  label="How We Met"
                  placeholder="Select source"
                  options={howWeMetOptions}
                />
                <SelectField
                  control={control}
                  name="workIndustry"
                  label="Work / Industry"
                  placeholder="Select industry"
                  options={workIndustryOptions}
                />
              </div>
            </section>

            {/* Vitals */}
            <section>
              <h2 className="text-lg font-semibold text-indigo-600 mb-4 border-l-4 border-indigo-600 pl-2 font-brockmann">Vitals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currentVibe" className="text-sm font-medium">Current Life Vibe</Label>
                  <Input
                    {...form.register("currentVibe")}
                    id="currentVibe"
                    placeholder="e.g., Building My Empire"
                  />
                </div>
                <SelectField
                  control={control}
                  name="relationshipGoal"
                  label="Relationship Goal"
                  placeholder="Select goal"
                  options={relationshipGoalOptions}
                />
                <SelectField
                  control={control}
                  name="spiritualBeliefs"
                  label="Spiritual Beliefs"
                  placeholder="Select belief"
                  options={spiritualBeliefsOptions}
                />
                <SelectField
                  control={control}
                  name="communicationStyle"
                  label="Communication Style"
                  placeholder="Select style"
                  options={communicationStyleOptions}
                />
                <SelectField
                  control={control}
                  name="coreValue"
                  label="A Core Value"
                  placeholder="Select core value"
                  options={coreValueOptions}
                />
              </div>
            </section>

            {/* Personality Profile */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-indigo-600 border-l-4 border-indigo-600 pl-2 font-brockmann">Personality Profile</h2>
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPersonality}
                    onChange={() => setShowPersonality(!showPersonality)}
                    className="accent-indigo-600 h-4 w-4"
                  />
                  Add Personality Profile
                </label>
              </div>
              {showPersonality && (
                <div className="space-y-6 bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="space-y-2">
                    <label htmlFor="mbtiType" className="text-sm font-medium">MBTI Type</label>
                    <input
                      {...form.register("mbtiType")}
                      id="mbtiType"
                      placeholder="e.g., INFJ"
                      onChange={handleMbtiTypeChange}
                      maxLength={4}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <BipolarSliderField
                      control={control}
                      name="mbtiIe"
                      label="Introversion / Extraversion"
                      leftLabel="I"
                      rightLabel="E"
                      min={0}
                      max={100}
                    />
                    <BipolarSliderField
                      control={control}
                      name="mbtiNs"
                      label="Sensing / Intuition"
                      leftLabel="S"
                      rightLabel="N"
                      min={0}
                      max={100}
                    />
                    <BipolarSliderField
                      control={control}
                      name="mbtiFt"
                      label="Thinking / Feeling"
                      leftLabel="T"
                      rightLabel="F"
                      min={0}
                      max={100}
                    />
                    <BipolarSliderField
                      control={control}
                      name="mbtiJp"
                      label="Perceiving / Judging"
                      leftLabel="P"
                      rightLabel="J"
                      min={0}
                      max={100}
                    />
                  </div>
                  <h3 className="font-semibold pt-4">Attachment Style</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <BipolarSliderField
                      control={control}
                      name="attachmentAnxiety"
                      label="Anxiety"
                      leftLabel="Low"
                      rightLabel="High"
                      min={-5}
                      max={5}
                    />
                    <BipolarSliderField
                      control={control}
                      name="attachmentAvoidance"
                      label="Avoidance"
                      leftLabel="Low"
                      rightLabel="High"
                      min={-5}
                      max={5}
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Ability Scores */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-indigo-600 border-l-4 border-indigo-600 pl-2 font-brockmann">Ability Scores</h2>
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAbilities}
                    onChange={() => setShowAbilities(!showAbilities)}
                    className="accent-indigo-600 h-4 w-4"
                  />
                  Add Ability Scores
                </label>
              </div>
              {showAbilities && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <SliderField
                    control={control}
                    name="abilityIntuition"
                    label="Intuition"
                    min={0}
                    max={10}
                    step={1}
                  />
                  <SliderField
                    control={control}
                    name="abilityEmpathy"
                    label="Empathy"
                    min={0}
                    max={10}
                    step={1}
                  />
                  <SliderField
                    control={control}
                    name="abilityAmbition"
                    label="Ambition"
                    min={0}
                    max={10}
                    step={1}
                  />
                  <SliderField
                    control={control}
                    name="abilityIntellect"
                    label="Intellect"
                    min={0}
                    max={10}
                    step={1}
                  />
                  <SliderField
                    control={control}
                    name="abilityCreativity"
                    label="Creativity"
                    min={0}
                    max={10}
                    step={1}
                  />
                  <SliderField
                    control={control}
                    name="abilitySelfAwareness"
                    label="Self Awareness"
                    min={0}
                    max={10}
                    step={1}
                  />
                </div>
              )}
            </section>

            {/* Reader's Notes */}
            <section>
              <h2 className="text-lg font-semibold text-indigo-600 mb-4 border-l-4 border-indigo-600 pl-2 font-brockmann">Reader's Notes</h2>
              <div className="space-y-2">
                <Textarea
                  {...form.register("readerNotes")}
                  placeholder="Private insights about this client..."
                  className="min-h-[100px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  These notes are for your eyes only.
                </p>
              </div>
            </section>

            {/* Submit Button */}
            <div className="sticky bottom-0 bg-background py-4 border-t flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Client"}
              </Button>
            </div>
          </form>
        </FormProvider>
        </CardContent>
      </Card>
    </div>
  );

}
