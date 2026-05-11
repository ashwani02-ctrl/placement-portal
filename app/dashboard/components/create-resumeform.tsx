"use client"
import { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  Pencil,
  Plus,
  Trash2,
  FileText,
  User,
  Mail,
  Phone,
  Globe,
  GraduationCap,
  Briefcase,
  LayoutList,
  X,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StudentTemplate {
  value: string;
  label: string;
}

interface MiscField {
  id: number;
  label: string;
  value: string;
  editing: boolean;
}

interface EducationEntry {
  id: number;
  title: string;
  organisation: string;
  city: string;
  country: string;
  from: string;
  to: string;
  ongoing: boolean;
  subjects: string;
}

interface ExperienceEntry {
  id: number;
  occupation: string;
  employer: string;
  from: string;
  to: string;
  ongoing: boolean;
  activities: string;
  city: string;
  country: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STUDENT_TEMPLATES: StudentTemplate[] = [
  { value: "fresh", label: "Fresh Graduate" },
  { value: "intern", label: "Intern / Trainee" },
  { value: "experienced", label: "Experienced" },
  { value: "custom", label: "Custom" },
];

const COUNTRIES = [
  "India", "United States", "United Kingdom", "Germany", "France",
  "Canada", "Australia", "Singapore", "UAE", "Other",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string): string => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

// ─── Education Card ───────────────────────────────────────────────────────────

type EducationFormData = Omit<EducationEntry, "id">;

const EMPTY_EDUCATION: EducationFormData = {
  title: "", organisation: "",
  city: "", country: "", from: "", to: "", ongoing: false, subjects: "",
};

function EducationCard({
  entry,
  onDelete,
}: {
  entry: EducationEntry;
  onDelete: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const from = formatDate(entry.from);
  const to = entry.ongoing ? "Present" : formatDate(entry.to);
  const dateRange = [from, to].filter(Boolean).join(" - ");
  const location = [entry.city, entry.country].filter(Boolean).join(", ");
  const meta = [dateRange, location].filter(Boolean).join(" | ");

  return (
    <div className="border border-slate-200 rounded-xl px-5 py-4 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-blue-600 truncate">{entry.title || "Untitled"}</p>
          {entry.organisation && <p className="text-sm text-slate-500 mt-0.5">{entry.organisation}</p>}
          {meta && <p className="text-xs text-slate-400 mt-2">{meta}</p>}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button size="icon" variant="ghost"
            className="h-7 w-7 text-slate-400 hover:text-red-500 hover:bg-red-50"
            onClick={() => onDelete(entry.id)} title="Remove">
            <X className="w-3.5 h-3.5" />
          </Button>
          <Button size="icon" variant="ghost"
            className="h-7 w-7 text-slate-400 hover:text-slate-700"
            onClick={() => setExpanded((v) => !v)}>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      {expanded && entry.subjects && (
        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">
          {entry.subjects}
        </div>
      )}
    </div>
  );
}

// ─── Education Form ───────────────────────────────────────────────────────────

function EducationForm({ onSave }: { onSave: (entry: EducationFormData) => void }) {
  const [form, setForm] = useState<EducationFormData>(EMPTY_EDUCATION);
  const set = <K extends keyof EducationFormData>(key: K, value: EducationFormData[K]): void =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = (): void => {
    if (!form.title.trim()) return;
    onSave(form);
    setForm(EMPTY_EDUCATION);
  };

  return (
    <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600">
            Title of qualification/credential awarded <span className="text-red-500">*</span>
          </Label>
          <Input value={form.title} onChange={(e) => set("title", e.target.value)}
            placeholder="Title of the qualification"
            className="h-10 border-slate-300 rounded-lg text-sm bg-white" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600">Organisation providing education and training</Label>
          <Input value={form.organisation} onChange={(e) => set("organisation", e.target.value)}
            placeholder="Name of the organisation"
            className="h-10 border-slate-300 rounded-lg text-sm bg-white" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600">City</Label>
          <Input value={form.city} onChange={(e) => set("city", e.target.value)}
            placeholder="e.g Paris" className="h-10 border-slate-300 rounded-lg text-sm bg-white" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600">Country</Label>
          <Select value={form.country} onValueChange={(v) => set("country", v)}>
            <SelectTrigger className="h-10 border-slate-300 rounded-lg text-sm bg-white">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600">From</Label>
          <Input type="date" value={form.from} onChange={(e) => set("from", e.target.value)}
            className="h-10 border-slate-300 rounded-lg text-sm bg-white" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600">To</Label>
          <Input type="date" value={form.to} disabled={form.ongoing}
            onChange={(e) => set("to", e.target.value)}
            className="h-10 border-slate-300 rounded-lg text-sm bg-white disabled:opacity-50" />
          <div className="flex items-center gap-2 pt-1">
            <Checkbox id="edu-ongoing" checked={form.ongoing}
              onCheckedChange={(v) => set("ongoing", Boolean(v))} />
            <label htmlFor="edu-ongoing" className="text-xs text-slate-500 cursor-pointer select-none">Ongoing</label>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-slate-600">Main subject/occupational skills covered</Label>
        <div className="border rounded-2xl overflow-hidden bg-background">
          <SimpleEditor
            value={form.subjects}
            onChange={(value) => set("subjects", value)}
          />

        </div>


      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!form.title.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 h-9 rounded-lg flex items-center gap-2 disabled:opacity-50">
          <Check className="w-4 h-4" />
          Save Education
        </Button>
      </div>
    </div>
  );
}

// ─── Experience Card ──────────────────────────────────────────────────────────

type ExperienceFormData = Omit<ExperienceEntry, "id">;

const EMPTY_EXPERIENCE: ExperienceFormData = {
  occupation: "", employer: "", from: "", to: "",
  ongoing: false, activities: "", city: "", country: "",
};

function ExperienceCard({
  entry,
  onDelete,
}: {
  entry: ExperienceEntry;
  onDelete: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const from = formatDate(entry.from);
  const to = entry.ongoing ? "Present" : formatDate(entry.to);
  const dateRange = [from, to].filter(Boolean).join(" - ");
  const location = [entry.city, entry.country].filter(Boolean).join(", ");
  const meta = [dateRange, location].filter(Boolean).join(" | ");

  return (
    <div className="border border-slate-200 rounded-xl px-5 py-4 bg-white shadow-sm">
      {/* Summary row — always visible */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-blue-600 truncate">
            {entry.occupation || "Untitled"}
          </p>
          {entry.employer && (
            <p className="text-sm text-slate-500 mt-0.5">{entry.employer}</p>
          )}
          {meta && (
            <p className="text-xs text-slate-400 mt-2">{meta}</p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="icon" variant="ghost"
            className="h-7 w-7 text-slate-400 hover:text-red-500 hover:bg-red-50"
            onClick={() => onDelete(entry.id)} title="Remove"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon" variant="ghost"
            className="h-7 w-7 text-slate-400 hover:text-slate-700"
            onClick={() => setExpanded((v) => !v)}
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Expanded: main activities */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          {entry.activities ? (
            <>
              <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                Main Activities & Responsibilities
              </p>
              <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">
                {entry.activities}
              </p>
            </>
          ) : (
            <p className="text-xs text-slate-400 italic">No activities listed.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Experience Form ──────────────────────────────────────────────────────────

function ExperienceForm({ onSave }: { onSave: (entry: ExperienceFormData) => void }) {
  const [form, setForm] = useState<ExperienceFormData>(EMPTY_EXPERIENCE);
  const set = <K extends keyof ExperienceFormData>(key: K, value: ExperienceFormData[K]): void =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = (): void => {
    if (!form.occupation.trim()) return;
    onSave(form);
    setForm(EMPTY_EXPERIENCE);
  };

  return (
    <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-5">

      {/* Row 1: Occupation + Employer */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600">
            Occupation or position held <span className="text-red-500">*</span>
          </Label>
          <Input
            value={form.occupation}
            onChange={(e) => set("occupation", e.target.value)}
            placeholder="Title of the occupation"
            className="h-10 border-slate-300 rounded-lg text-sm bg-white"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600">Employer</Label>
          <Input
            value={form.employer}
            onChange={(e) => set("employer", e.target.value)}
            placeholder="Name of the Employer"
            className="h-10 border-slate-300 rounded-lg text-sm bg-white"
          />
        </div>
      </div>

      {/* Row 2: From + To + Ongoing */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600">From</Label>
          <Input
            type="date"
            value={form.from}
            onChange={(e) => set("from", e.target.value)}
            className="h-10 border-slate-300 rounded-lg text-sm bg-white"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600">To</Label>
          <Input
            type="date"
            value={form.to}
            disabled={form.ongoing}
            onChange={(e) => set("to", e.target.value)}
            className="h-10 border-slate-300 rounded-lg text-sm bg-white disabled:opacity-50"
          />
          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="exp-ongoing"
              checked={form.ongoing}
              onCheckedChange={(v) => set("ongoing", Boolean(v))}
            />
            <label htmlFor="exp-ongoing" className="text-xs text-slate-500 cursor-pointer select-none">
              Ongoing
            </label>
          </div>
        </div>
      </div>

      {/* Row 3: Activities */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-slate-600">
          Main activities and responsibilities
        </Label>
        <div className="border rounded-2xl overflow-hidden bg-background">
          <SimpleEditor
            value={form.activities}
            onChange={(value) => set("activities", value)}

          />

        </div>
      </div>

      {/* Row 4: City + Country */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600">City</Label>
          <Input
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            placeholder="e.g Paris"
            className="h-10 border-slate-300 rounded-lg text-sm bg-white"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600">Country</Label>
          <Select value={form.country} onValueChange={(v) => set("country", v)}>
            <SelectTrigger className="h-10 border-slate-300 rounded-lg text-sm bg-white">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!form.occupation.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 h-9 rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          Save Experience
        </Button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ResumeForm() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [socialMedia, setSocialMedia] = useState<string>("");
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>([]);
  const [experienceEntries, setExperienceEntries] = useState<ExperienceEntry[]>([]);
  const [skills, setSkills] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [miscFields, setMiscFields] = useState<MiscField[]>([]);

  // ── Education handlers ───────────────────────────────────────────────────

  const saveEducation = (entry: EducationFormData): void => {
    setEducationEntries((prev) => [...prev, { ...entry, id: Date.now() }]);
  };
  const deleteEducation = (id: number): void => {
    setEducationEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // ── Experience handlers ──────────────────────────────────────────────────

  const saveExperience = (entry: ExperienceFormData): void => {
    setExperienceEntries((prev) => [...prev, { ...entry, id: Date.now() }]);
  };
  const deleteExperience = (id: number): void => {
    setExperienceEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // ── Misc field handlers ──────────────────────────────────────────────────

  const addMiscField = (): void => {
    setMiscFields((prev) => [...prev, { id: Date.now(), label: "", value: "", editing: true }]);
  };
  const updateMiscLabel = (id: number, label: string): void => {
    setMiscFields((prev) => prev.map((f) => (f.id === id ? { ...f, label } : f)));
  };
  const confirmMiscLabel = (id: number): void => {
    setMiscFields((prev) => prev.map((f) => (f.id === id ? { ...f, editing: false } : f)));
  };
  const renameMiscField = (id: number): void => {
    setMiscFields((prev) => prev.map((f) => (f.id === id ? { ...f, editing: true } : f)));
  };
  const updateMiscValue = (id: number, value: string): void => {
    setMiscFields((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)));
  };
  const removeMiscField = (id: number): void => {
    setMiscFields((prev) => prev.filter((f) => f.id !== id));
  };

  // ── Form reset ───────────────────────────────────────────────────────────

  const handleReset = (): void => {
    setName(""); setEmail(""); setPhone(""); setSocialMedia("");
    setEducationEntries([]); setExperienceEntries([]);
    setSkills(""); setSummary(""); setSelectedTemplate(""); setMiscFields([]);
  };

  const router = useRouter();

  const resumeData = {
    selectedTemplate,
    name,
    email,
    phone,
    socialMedia,
    educationEntries,
    experienceEntries,
    skills,
    summary,
    miscFields,
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 font-sans">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 text-white rounded-xl p-2.5 shadow-md">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Resume Generator</h1>
            <p className="text-sm text-slate-500">Fill in your details to create a professional resume</p>
          </div>
        </div>

        <Card className="shadow-sm border border-slate-200 rounded-2xl overflow-hidden">

          {/* Card Header */}
          <CardHeader className="bg-white border-b border-slate-100 px-6 py-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Label className="text-sm font-semibold text-slate-700 whitespace-nowrap">Student:</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger className="w-44 border-slate-300 rounded-lg text-sm h-9">
                    <SelectValue placeholder="— Select —" />
                  </SelectTrigger>
                  <SelectContent>
                    {STUDENT_TEMPLATES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9 border-slate-300 text-slate-600 hover:bg-slate-100" title="Edit">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="default" size="icon" className="h-9 w-9 bg-green-500 hover:bg-green-600 text-white border-none" title="Add new">
                  <Plus className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 border-slate-300 text-slate-600 hover:bg-slate-100" title="Preview"
                  onClick={() => setPreviewMode(!previewMode)}>
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {selectedTemplate && (
              <Badge variant="secondary" className="mt-2 w-fit text-xs capitalize">
                Template: {STUDENT_TEMPLATES.find((t) => t.value === selectedTemplate)?.label}
              </Badge>
            )}
          </CardHeader>

          <CardContent className="px-6 py-6 space-y-6 bg-white">

            {/* Name */}
            <div className="grid grid-cols-[160px_1fr] items-center gap-4">
              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" /> Name:
              </Label>
              <Input value={name} onChange={(e) => setName(e.target.value)}
                placeholder="John Doe" className="h-10 border-slate-300 rounded-lg text-sm" />
            </div>

            <Separator className="bg-slate-100" />

            {/* Email */}
            <div className="grid grid-cols-[160px_1fr] items-center gap-4">
              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" /> Email:
              </Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com" className="h-10 border-slate-300 rounded-lg text-sm" />
            </div>

            <Separator className="bg-slate-100" />

            {/* Phone */}
            <div className="grid grid-cols-[160px_1fr] items-center gap-4">
              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" /> Phone:
              </Label>
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210" className="h-10 border-slate-300 rounded-lg text-sm" />
            </div>

            <Separator className="bg-slate-100" />

            {/* Social Media */}
            <div className="grid grid-cols-[160px_1fr] items-start gap-4">
              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2 pt-2.5">
                <Globe className="w-4 h-4 text-slate-400" /> Social media:
              </Label>
              <Textarea value={socialMedia} onChange={(e) => setSocialMedia(e.target.value)}
                placeholder={`LinkedIn: https://linkedin.com/in/...\nGitHub: https://github.com/...\nPortfolio: https://...`}
                className="min-h-[120px] border-slate-300 rounded-lg text-sm resize-y" />
            </div>

            <Separator className="bg-slate-100" />

            {/* Education Section */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-400" /> Education:
              </Label>
              {educationEntries.length > 0 && (
                <div className="space-y-3">
                  {educationEntries.map((entry) => (
                    <EducationCard key={entry.id} entry={entry} onDelete={deleteEducation} />
                  ))}
                </div>
              )}
              <EducationForm onSave={saveEducation} />
            </div>

            <Separator className="bg-slate-100" />

            {/* Experience Section */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" /> Experience:
              </Label>
              {experienceEntries.length > 0 && (
                <div className="space-y-3">
                  {experienceEntries.map((entry) => (
                    <ExperienceCard key={entry.id} entry={entry} onDelete={deleteExperience} />
                  ))}
                </div>
              )}
              <ExperienceForm onSave={saveExperience} />
            </div>

            <Separator className="bg-slate-100" />

            {/* Skills */}
            <div className=" space-y-1.5">
              <Label className="text-sm font-semibold text-slate-700 pt-2.5">Skills:</Label>
              <div className="border rounded-2xl overflow-hidden bg-background">
                <SimpleEditor
                  value={skills}
                  onChange={(value) => setSkills(value)}
                />

              </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* Summary */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-slate-700 pt-2.5">Summary:</Label>
              <div className="border rounded-2xl overflow-hidden bg-background">
                <SimpleEditor
                  value={summary}
                  onChange={(value) => setSummary(value)}
                />

              </div>
            </div>

            {/* Dynamic Misc Fields */}
            {miscFields.map((field) => (
              <div key={field.id}>
                <Separator className="bg-slate-100" />
                <div className="space-y-1.5">
                  <div className="pt-2.5 flex items-start gap-1">
                    {field.editing ? (
                      <div className="flex items-center gap-1 w-full">
                        <Input autoFocus value={field.label}
                          onChange={(e) => updateMiscLabel(field.id, e.target.value)}
                          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === "Enter") confirmMiscLabel(field.id);
                          }}
                          placeholder="Section name..."
                          className="h-8 text-sm border-blue-300 focus:ring-blue-400 rounded-md px-2" />
                        <Button size="icon" variant="ghost"
                          className="h-8 w-8 text-green-600 hover:bg-green-50 shrink-0"
                          onClick={() => confirmMiscLabel(field.id)} title="Confirm name">
                          <Check className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 w-full">
                        <span className="text-sm font-semibold text-slate-700 cursor-pointer hover:text-blue-600 truncate"
                          title="Click to rename" onClick={() => renameMiscField(field.id)}>
                          {field.label || "Untitled"}:
                        </span>
                        <Button size="icon" variant="ghost"
                          className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 shrink-0 ml-auto"
                          onClick={() => removeMiscField(field.id)} title="Remove section">
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="border rounded-2xl overflow-hidden bg-background">
                    <SimpleEditor
                      value={field.value}
                      onChange={(value) => updateMiscValue(field.id, value)}
                    />

                  </div>
                </div>
              </div>
            ))}

            {/* Add Custom Section */}
            <div className="pt-1">
              <Button variant="outline" onClick={addMiscField}
                className="w-full border-dashed border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 flex items-center gap-2 h-10 rounded-lg transition-colors">
                <LayoutList className="w-4 h-4" />
                Add Custom Section
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" onClick={handleReset}
                className="border-slate-300 text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Clear
              </Button>
              <Button
                type="button"
                onClick={() => {
                  localStorage.setItem(
                    "resumeData",
                    JSON.stringify(resumeData)
                  );

                  router.push("/dashboard/resume-generator/preview");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6">
                <FileText className="w-4 h-4" /> Preview
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}