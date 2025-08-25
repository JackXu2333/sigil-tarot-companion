import { useState, useEffect } from "react";
import { useForm, type Control } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { clientService } from "@/services/clientService";
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

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

import { cn, typography } from "@/lib/utils";

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

// Reusable Slider Field Component using FormField pattern
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
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = field.value as number ?? (min + max) / 2;
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="flex items-center gap-4">
                <Slider
                  value={[value]}
                  onValueChange={(values) => field.onChange(values[0])}
                  min={min}
                  max={max}
                  step={step}
                  className="flex-1"
                />
                <span className={cn("w-10 text-right text-foreground", typography.chart.value)}>
                  {value}
                </span>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

// Reusable Bipolar Slider Field Component using FormField pattern
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
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = field.value as number ?? (min + max) / 2;
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="flex items-center gap-2">
                <span className={cn("text-muted-foreground w-4 text-left", typography.chart.label)}>{leftLabel}</span>
                <Slider
                  value={[value]}
                  onValueChange={(values) => field.onChange(values[0])}
                  min={min}
                  max={max}
                  step={1}
                  className="flex-1"
                />
                <span className={cn("text-muted-foreground w-4 text-right", typography.chart.label)}>{rightLabel}</span>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

// Improved SelectField using FormField pattern
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
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select value={field.value != null ? String(field.value) : ""} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
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

  // Utility function to convert undefined to null for database consistency
  const toNull = (value: string | undefined): string | null => value || null;
  
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
        pronouns: toNull(pronouns),
        how_we_met: toNull(howWeMet),
        birth_day: toNull(birthDay),
        ethnicity: toNull(ethnicity),
        current_vibe: toNull(currentVibe),
        relationship_goal: toNull(relationshipGoal),
        work_industry: toNull(workIndustry),
        spiritual_beliefs: toNull(spiritualBeliefs),
        communication_style: toNull(communicationStyle),
        core_value: toNull(coreValue),
        reader_notes: toNull(readerNotes),
        avatar: null,
        tags: null,
        last_contact: null,
        client_since: null,
      });

      if (newClient && newClient.id) {
        if (showPersonality) {
          await clientService.updateClientMBTI(newClient.id, {
            mbti_type: toNull(values.mbtiType),
            ie_score: values.mbtiIe ?? null,
            ns_score: values.mbtiNs ?? null,
            ft_score: values.mbtiFt ?? null,
            jp_score: values.mbtiJp ?? null,
          });
          await clientService.updateClientAttachment(newClient.id, {
            anxiety_score: values.attachmentAnxiety ?? null,
            avoidance_score: values.attachmentAvoidance ?? null,
          });
        }

        if (showAbilities) {
          await clientService.updateClientAbilities(newClient.id, {
            intuition: values.abilityIntuition ?? null,
            empathy: values.abilityEmpathy ?? null,
            ambition: values.abilityAmbition ?? null,
            intellect: values.abilityIntellect ?? null,
            creativity: values.abilityCreativity ?? null,
            self_awareness: values.abilitySelfAwareness ?? null,
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
  <div className="min-h-screen bg-background p-4 sm:p-8">
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
            <p className={cn("text-muted-foreground", typography.body.default)}>
              Create a new client profile to begin tracking your readings and insights.
            </p>
          </div>
        </CardHeader>

        <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Basic Info */}
            <section>
              <h2 className={cn("text-primary mb-4 border-l-4 border-primary pl-2", typography.display.h2)}>Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Luna Blackwood"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SelectField
                  control={control}
                  name="pronouns"
                  label="Pronouns"
                  placeholder="Select pronouns"
                  options={pronounOptions}
                />
                <FormField
                  control={control}
                  name="birthDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birthday</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              <h2 className={cn("text-primary mb-4 border-l-4 border-primary pl-2", typography.display.h2)}>Vitals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name="currentVibe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Life Vibe</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Building My Empire"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                {/* Empty div to balance the grid when odd number of fields */}
                <div className="md:block hidden"></div>
              </div>
            </section>

            {/* Personality Profile */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className={cn("text-primary border-l-4 border-primary pl-2", typography.display.h2)}>Personality Profile</h2>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="personality-toggle"
                    checked={showPersonality}
                    onCheckedChange={(checked) => setShowPersonality(checked === true)}
                  />
                  <Label htmlFor="personality-toggle" className="text-sm font-medium cursor-pointer">
                    Add Personality Profile
                  </Label>
                </div>
              </div>
              {showPersonality && (
                <div className="space-y-6 bg-muted rounded-lg p-4 border">
                  <FormField
                    control={control}
                    name="mbtiType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MBTI Type</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., INFJ"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleMbtiTypeChange(e);
                            }}
                            maxLength={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <h2 className={cn("text-primary border-l-4 border-primary pl-2", typography.display.h2)}>Ability Scores</h2>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="abilities-toggle"
                    checked={showAbilities}
                    onCheckedChange={(checked) => setShowAbilities(checked === true)}
                  />
                  <Label htmlFor="abilities-toggle" className="text-sm font-medium cursor-pointer">
                    Add Ability Scores
                  </Label>
                </div>
              </div>
              {showAbilities && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted rounded-lg p-4 border">
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
              <h2 className={cn("text-primary mb-4 border-l-4 border-primary pl-2", typography.display.h2)}>Reader's Notes</h2>
              <FormField
                control={control}
                name="readerNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Private insights about this client..."
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      These notes are for your eyes only.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
        </Form>
        </CardContent>
      </Card>
    </div>
  );

}
