import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import dayjs, { Dayjs } from "dayjs";
import { ChatData } from "./chat-interface";

// Función auxiliar para generar colores aleatorios pastel
const getRandomPastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return {
    background: `hsl(${hue}, 70%, 90%)`,
    text: `hsl(${hue}, 70%, 30%)`,
  };
};

// Añade estos tipos
type Priority = "Highest" | "High" | "Medium" | "Low" | "Lowest";

interface PriorityOption {
  value: Priority;
  label: string;
  color: string;
  bgColor: string;
}

const priorities: PriorityOption[] = [
  {
    value: "Highest",
    label: "Highest",
    color: "rgb(215, 50, 30)",
    bgColor: "rgba(215, 50, 30, 0.1)",
  },
  {
    value: "High",
    label: "High",
    color: "rgb(235, 120, 30)",
    bgColor: "rgba(235, 120, 30, 0.1)",
  },
  {
    value: "Medium",
    label: "Medium",
    color: "rgb(66, 82, 220)",
    bgColor: "rgba(66, 82, 220, 0.1)",
  },
  {
    value: "Low",
    label: "Low",
    color: "rgb(0, 101, 255)",
    bgColor: "rgba(0, 101, 255, 0.1)",
  },
  {
    value: "Lowest",
    label: "Lowest",
    color: "rgb(0, 135, 255)",
    bgColor: "rgba(0, 135, 255, 0.1)",
  },
];

// Añade esta interfaz para tipar los datos del ticket
interface TicketData {
  title: string;
  description: string;
  requirements: string;
  reproductionSteps: string;
  dueDate: Date | null;
  priority: Priority;
  tags: Array<{
    id: number;
    text: string;
    colors: {
      background: string;
      text: string;
    };
  }>;
  code: string;
}

export default function TaskCard({ params }: { params?: ChatData }) {
  const [tags, setTags] = useState([
    {
      id: 1,
      text: "Bug",
      colors: { background: "hsl(270, 70%, 90%)", text: "hsl(270, 70%, 30%)" },
    },
    {
      id: 2,
      text: "AG Grid",
      colors: { background: "hsl(30, 70%, 90%)", text: "hsl(30, 70%, 30%)" },
    },
    {
      id: 3,
      text: "Frontend",
      colors: { background: "hsl(0, 70%, 90%)", text: "hsl(0, 70%, 30%)" },
    },
  ]);
  const [newTag, setNewTag] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [reproductionSteps, setReproductionSteps] = useState("");
  const [code, setCode] = useState("");
  const [mounted, setMounted] = useState(false);

  // Referencias para los textareas
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const requirementsRef = useRef<HTMLTextAreaElement>(null);
  const reproductionStepsRef = useRef<HTMLTextAreaElement>(null);

  // Usar useEffect para manejar la hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  // Usar los datos del chat para actualizar la tarjeta
  useEffect(() => {
    if (params) {
      const {
        title,
        description,
        requirements,
        reproductionSteps,
        limitDate,
        priority,
        labels,
      } = params;

      // Usar funciones de actualización de estado para evitar problemas de sincronización
      setTitle((prev) => title || prev);
      setDescription((prev) => description || prev);
      setRequirements((prev) => requirements || prev);
      setReproductionSteps((prev) => reproductionSteps || prev);
      setDueDate((prev) => (limitDate ? dayjs(limitDate) : prev));
      setPriority((prev) => (priority as Priority) || prev);

      if (labels && labels.length > 0) {
        setTags(
          labels.map((label: string, index: number) => ({
            id: index,
            text: label,
            colors: getRandomPastelColor(),
          }))
        );
      }
    }
  }, [params]); // Solo depender de chatData

  // Si no está montado, no renderizar nada o mostrar un placeholder
  if (!mounted) {
    return (
      <div className="w-full max-w-4xl h-screen bg-gray-100 animate-pulse" />
    );
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      setTags([
        ...tags,
        {
          id: Date.now(),
          text: newTag.trim(),
          colors: getRandomPastelColor(),
        },
      ]);
      setNewTag("");
    }
  };

  const handleDeleteTag = (tagId: number) => {
    setTags(tags.filter((tag) => tag.id !== tagId));
  };

  const handleSave = () => {
    const ticketData: TicketData = {
      title: "Add functionality to Rebalance Dashboard",
      description: descriptionRef.current?.value || "",
      requirements: requirementsRef.current?.value || "",
      reproductionSteps: reproductionStepsRef.current?.value || "",
      dueDate: dueDate?.toDate() || null,
      priority,
      tags,
      code,
    };

    console.log(JSON.stringify(ticketData, null, 2));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Description</h3>
            <textarea
              ref={descriptionRef}
              className=" border border-dashed border-muted-foreground/25 rounded-lg p-4 w-full"
              defaultValue={description}
              placeholder="Enter a detailed description..."
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Requirements</h3>
            <textarea
              ref={requirementsRef}
              className="border border-dashed border-muted-foreground/25 rounded-lg p-4 w-full"
              defaultValue={requirements}
              placeholder="List the requirements..."
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">How to Reproduce</h3>
            <textarea
              ref={reproductionStepsRef}
              className="border border-dashed border-muted-foreground/25 rounded-lg p-4 w-full"
              defaultValue={reproductionSteps}
              placeholder="Describe the steps to reproduce..."
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Code</h3>
            <div className="relative flex border border-dashed border-muted-foreground/25 rounded-lg bg-gray-50">
              <div
                className="py-4 px-2 text-right text-gray-500 bg-gray-100 select-none"
                style={{ minWidth: "3rem" }}
              >
                {code.split("\n").map((_, i) => (
                  <div key={i + 1} className="leading-6">
                    {i + 1}
                  </div>
                ))}
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono text-sm p-4 w-full min-h-[200px] bg-transparent resize-none leading-6 focus:outline-none"
                placeholder="Enter your code here..."
                style={{ lineHeight: "1.5rem" }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Due Date</h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Due Date"
                  value={dueDate}
                  className="border border-dashed border-muted-foreground/25 rounded-lg p-4 w-full"
                  onChange={(newValue: Dayjs | null) => setDueDate(newValue)}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Priority</h3>
            <div className="relative">
              <button
                onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{
                      backgroundColor: priorities.find(
                        (p) => p.value === priority
                      )?.color,
                    }}
                  />
                  <span>{priority}</span>
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showPriorityDropdown && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-lg shadow-lg z-10">
                  {priorities.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setPriority(option.value);
                        setShowPriorityDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      style={{
                        color: option.color,
                        backgroundColor:
                          priority === option.value
                            ? option.bgColor
                            : undefined,
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: option.color }}
                      />
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Etiquetas</h3>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-1 rounded-full px-3 py-1"
                    style={{
                      backgroundColor: tag.colors.background,
                      color: tag.colors.text,
                    }}
                  >
                    <span>{tag.text}</span>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="hover:opacity-75"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Añadir etiqueta..."
                className="w-full px-3 py-1 border border-dashed border-muted-foreground/25 rounded-lg focus:outline-none focus:border-solid"
              />
            </div>
          </div>
        </div>
      </CardContent>

      {/* Añadir el botón de guardar al final del Card */}
      <div className="px-6 py-4 border-t">
        <button
          onClick={handleSave}
          className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
      </div>
    </Card>
  );
}
