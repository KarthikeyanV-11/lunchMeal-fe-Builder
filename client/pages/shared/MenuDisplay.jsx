import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Users,
  DollarSign,
  Calendar,
  Clock,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMenu } from "@/contexts/MenuContext";
import { toast } from "@/hooks/use-toast";

export default function MenuDisplay() {
  const { role, selectedDate } = useParams();
  const navigate = useNavigate();
  const { role: userRole } = useAuth();
  const { fetchMenuForDate, loading } = useMenu(); // getting the functionalities from the menuContext

  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  const date = new Date(selectedDate);
  const formattedDate = date.toLocaleDateString("en-GB");
  const today = new Date();

  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const isPastDate = date < today.setHours(0, 0, 0, 0);
  const isToday = date.toDateString() === today.toDateString();

  const attendanceDeadline = new Date(date);
  attendanceDeadline.setDate(attendanceDeadline.getDate() - 1);
  const canMarkAttendance = today <= attendanceDeadline && !isPastDate;

  /*helper function*/
  const getDayKey = (dateStr) => {
    const dayName = new Date(dateStr)
      .toLocaleDateString("en-US", {
        weekday: "long",
      })
      .toLowerCase();
    return dayName; // e.g., "friday"
  };

  useEffect(() => {
    async function loadMenu() {
      // const menu = await fetchMenuForDate(selectedDate);/
      // setMenuItems(menu || []);
      const week = await fetchMenuForDate(selectedDate); // fetches entire week
      if (week) {
        const dayKey = getDayKey(selectedDate); // e.g., "friday"
        const dayMenu = week[dayKey];
        setMenuItems(dayMenu?.menuItems || []);
      } else {
        setMenuItems([]);
      }
    }
    loadMenu();
  }, [selectedDate, fetchMenuForDate]);

  const handleAttendanceChange = (willAttend) => {
    if (!canMarkAttendance) {
      toast({
        title: "Attendance Closed",
        description: "Lunch attendance closed for this date",
        variant: "destructive",
      });
      return;
    }

    setAttendanceStatus(willAttend);
    toast({
      title: willAttend ? "Attendance Confirmed" : "Attendance Declined",
      description: willAttend
        ? "You will attend lunch on this date"
        : "You will skip lunch on this date",
      variant: willAttend ? "default" : "secondary",
    });
  };

  const handleGoBack = () => {
    navigate(`/${userRole}/calendar`);
  };

  if (isWeekend) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <Button variant="ghost" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Calendar
          </Button>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Lunch Service
              </h2>
              <p className="text-gray-600">
                {formattedDate} falls on a weekend. There is no lunch service on
                weekends.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Calendar</span>
          </Button>

          <Badge variant="outline" className="text-lg px-3 py-1">
            {formattedDate}
          </Badge>
        </div>

        {/* Date Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Lunch Menu - {formattedDate}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {isToday && (
              <Badge className="bg-blue-100 text-blue-800">Today</Badge>
            )}
            {isPastDate && <Badge variant="secondary">Past Date</Badge>}
            <span className="capitalize">{userRole} View</span>
          </div>
        </div>

        {/* Menu Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Menu Items</CardTitle>
          </CardHeader>

          <CardContent>
            {menuItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  No menu items available for this date
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-800">• {item}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employee Attendance Section */}
        {userRole === "employee" && !isPastDate && menuItems.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Attendance</span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              {canMarkAttendance ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    Will you attend lunch on {formattedDate}?
                  </p>
                  <div className="flex space-x-4">
                    <Button
                      onClick={() => handleAttendanceChange(true)}
                      className={`flex items-center space-x-2 ${
                        attendanceStatus === true ? "bg-green-600" : ""
                      }`}
                      variant={
                        attendanceStatus === true ? "default" : "outline"
                      }
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>I will attend lunch</span>
                    </Button>

                    <Button
                      onClick={() => handleAttendanceChange(false)}
                      className={`flex items-center space-x-2 ${
                        attendanceStatus === false ? "bg-red-600" : ""
                      }`}
                      variant={
                        attendanceStatus === false ? "default" : "outline"
                      }
                    >
                      <XCircle className="h-4 w-4" />
                      <span>I will skip lunch</span>
                    </Button>
                  </div>

                  {attendanceStatus !== null && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm">
                        ✓ Your attendance preference has been recorded
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-orange-700 font-medium">
                    Lunch attendance closed for this date
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Attendance must be marked at least 1 day in advance
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Admin Attendance Overview */}
        {userRole === "admin" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Attendance Overview</span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">42</div>
                  <div className="text-sm text-gray-600">Will Attend</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">8</div>
                  <div className="text-sm text-gray-600">Will Skip</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">106</div>
                  <div className="text-sm text-gray-600">No Response</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payroll Section */}
        {userRole === "payroll" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Financial Summary</span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Daily Cost</h4>
                  <p className="text-2xl font-bold text-gray-900">₹3,360</p>
                  <p className="text-sm text-gray-600">
                    42 attendees × ₹80 per meal
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Employee Share
                  </h4>
                  <p className="text-2xl font-bold text-green-600">₹1,680</p>
                  <p className="text-sm text-gray-600">50% subsidy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
