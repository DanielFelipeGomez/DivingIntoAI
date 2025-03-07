"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskCard, { handleSave } from "../components/task-card";
import ProtectedRoute from "../components/protected-route";
import { useAuth } from "../context/auth-context";
import { Badge } from "@/components/ui/badge";
import ChatInterface from "../components/chat-interface";

// Definition of the ticket interface
interface Ticket {
  id: number;
  title: string;
  description: string;
  requirenments?: string;
  reproductionSteps?: string;
  limitDate?: Date | null;
  priority: string;
  labels?: Array<{
    id: number;
    text: string;
    colors: {
      background: string;
      text: string;
    };
  }>;
}

export default function TicketsDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskCard, setShowTaskCard] = useState(false);
  const { logout } = useAuth();

  // Function to load tickets from Supabase
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data: Tickets, error } = await supabase
        .from("Tickets")
        .select("*");

      if (error) {
        console.error("Error loading tickets:", error);
        return;
      }

      setTickets(Tickets || []);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showNotification) {
      timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000); // 3 seconds
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [showNotification]);

  // Load tickets when component mounts
  useEffect(() => {
    fetchTickets();
  }, []);

  // Format date for display in the table
  const formatDate = (dateString?: string | Date | null) => {
    if (!dateString) return "Not defined";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center border-b border-gray-200">
          <h1 className="text-xl font-semibold">Tickets Dashboard</h1>
          <div className="flex space-x-2">
            <Button variant="default" onClick={() => setShowTaskCard(true)}>
              Create Ticket
            </Button>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading tickets...</div>
              ) : tickets.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left border">ID</th>
                        <th className="p-2 text-left border">Title</th>
                        <th className="p-2 text-left border">Description</th>
                        <th className="p-2 text-left border">Priority</th>
                        <th className="p-2 text-left border">Due Date</th>
                        <th className="p-2 text-left border">Labels</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket) => (
                        <tr
                          key={ticket.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-2 border">{ticket.id}</td>
                          <td className="p-2 border">{ticket.title}</td>
                          <td className="p-2 border">{ticket.description}</td>
                          <td className="p-2 border">
                            <Badge
                              className={`
                                ${
                                  ticket.priority === "Highest"
                                    ? "bg-red-100 text-red-800"
                                    : ""
                                }
                                ${
                                  ticket.priority === "High"
                                    ? "bg-orange-100 text-orange-800"
                                    : ""
                                }
                                ${
                                  ticket.priority === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : ""
                                }
                                ${
                                  ticket.priority === "Low"
                                    ? "bg-blue-100 text-blue-800"
                                    : ""
                                }
                                ${
                                  ticket.priority === "Lowest"
                                    ? "bg-gray-100 text-gray-800"
                                    : ""
                                }
                              `}
                            >
                              {ticket.priority}
                            </Badge>
                          </td>
                          <td className="p-2 border">
                            {formatDate(ticket.limitDate)}
                          </td>
                          <td className="p-2 border">
                            <div className="flex flex-wrap gap-1">
                              {ticket.labels &&
                                ticket.labels.map((label) => (
                                  <Badge
                                    key={label.id}
                                    style={{
                                      backgroundColor:
                                        label.colors?.background ||
                                        "hsl(270, 70%, 90%)",
                                      color:
                                        label.colors?.text ||
                                        "hsl(270, 70%, 30%)",
                                    }}
                                  >
                                    {label.text}
                                  </Badge>
                                ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No tickets available. Create a new one with the &quot;Create
                  Ticket&quot; button.
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        {showNotification && (
          <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg transition-opacity duration-500">
            <p className="font-medium">Ticket created successfully!</p>
          </div>
        )}

        {showTaskCard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-[90vw] max-h-[90vh] flex flex-col">
              <div className="p-4 flex justify-between items-center border-b shrink-0">
                <h2 className="text-xl font-semibold">Create New Ticket</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTaskCard(false)}
                >
                  <span className="sr-only">Close</span>
                  <span className="text-xl">×</span>
                </Button>
              </div>
              <div className="flex-1 overflow-auto">
                <ChatInterface inDialog={true}>
                  <TaskCard
                    params={undefined}
                    contextForModel={new Set()}
                    setContextForModel={() => {}}
                  />
                </ChatInterface>
              </div>
              <div className="p-4 border-t flex justify-end space-x-2 shrink-0">
                <Button
                  variant="outline"
                  onClick={() => setShowTaskCard(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    try {
                      handleSave();
                      setShowNotification(true);
                      setShowTaskCard(false);
                      fetchTickets(); // Reload tickets after creating a new one
                    } catch (error) {
                      console.error("Error saving ticket:", error);
                    }
                  }}
                >
                  Save and Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
