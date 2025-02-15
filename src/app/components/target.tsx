import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function TaskCard() {
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Añadir funcionalidad a Rebalance Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Description</h3>
            <textarea
              className="text-muted-foreground border border-dashed border-muted-foreground/25 rounded-lg p-4 w-full
            "
            >
              We have had feedback from a client that they find it frustrating
              that they add properties to the instrument grid then when they
              open the create or edit instrument modals they have to go through
              a process of adding those same properties again.
            </textarea>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Requirements</h3>
            <textarea className="border border-dashed border-muted-foreground/25 rounded-lg p-4  w-full">
              The properties do not appear in the create or edit dialog by
              default
            </textarea>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">How to reproduce it</h3>
            <textarea className="border border-dashed border-muted-foreground/25 rounded-lg p-4  w-full"></textarea>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Limite</h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="Basic date picker" />
              </LocalizationProvider>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Prioridad</h3>
            <div className="flex items-center gap-2">
              <Rating />
              <span className="text-orange-500 font-medium">Media</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Etiquetas</h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800 hover:bg-purple-100"
              >
                Bug
              </Badge>
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800 hover:bg-orange-100"
              >
                AG Grid
              </Badge>
              <Badge
                variant="secondary"
                className="bg-red-100 text-red-800 hover:bg-red-100"
              >
                Frontend
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
