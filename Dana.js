import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Edit,
  Save,
  X,
  UserPlus,
  Plus,
  Trash,
  Users,
  Menu,
  Settings
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MobileWorkshopManager = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [workshops, setWorkshops] = useState([
    {
      id: 1,
      name: "יוגה בוקר",
      instructor: "דנה כהן",
      date: "2024-11-01",
      time: "09:00",
      participants: [
        { name: "מיכל לוי" },
        { name: "רחל כהן" }
      ],
      waitlist: [],
      maxParticipants: 20,
      isEditing: false,
      description: "סדנת יוגה מרעננת לפתיחת הבוקר"
    }
  ]);
  
  const [currentUser] = useState({ name: "משתמשת לדוגמה" });

  // פונקציות ניהול
  const handleRegister = (workshop) => {
    const updatedWorkshops = workshops.map(w => {
      if (w.id === workshop.id) {
        if (w.participants.length < w.maxParticipants) {
          return {
            ...w,
            participants: [...w.participants, { name: currentUser.name }]
          };
        } else {
          return {
            ...w,
            waitlist: [...w.waitlist, { name: currentUser.name }]
          };
        }
      }
      return w;
    });
    setWorkshops(updatedWorkshops);
  };

  const handleAddWorkshop = (newWorkshop) => {
    setWorkshops([...workshops, {
      ...newWorkshop,
      id: workshops.length + 1,
      participants: [],
      waitlist: []
    }]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* כותרת וניווט */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="flex justify-between items-center p-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>תפריט</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => setIsAdmin(!isAdmin)}
                >
                  <Settings className="ml-2 h-4 w-4" />
                  {isAdmin ? "מצב משתמש" : "מצב ניהול"}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          
          <h1 className="text-xl font-bold">סדנאות קהילה</h1>
          
          {isAdmin && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Plus className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>הוספת סדנה חדשה</DialogTitle>
                </DialogHeader>
                <AddWorkshopForm onAdd={handleAddWorkshop} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* רשימת הסדנאות */}
      <div className="p-4 space-y-4">
        {workshops.map(workshop => (
          <Card key={workshop.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-bold">{workshop.name}</h2>
                  {isAdmin && (
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <p>מנחה: {workshop.instructor}</p>
                  <p>תאריך: {new Date(workshop.date).toLocaleDateString('he-IL')}</p>
                  <p>שעה: {workshop.time}</p>
                  <p>משתתפים: {workshop.participants.length}/{workshop.maxParticipants}</p>
                  <p>{workshop.description}</p>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Users className="h-4 w-4 ml-2" />
                        רשימת משתתפים
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>משתתפים - {workshop.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-bold mb-2">משתתפים:</h3>
                          <ul className="list-disc list-inside">
                            {workshop.participants.map((p, i) => (
                              <li key={i}>{p.name}</li>
                            ))}
                          </ul>
                        </div>
                        {workshop.waitlist.length > 0 && (
                          <div>
                            <h3 className="font-bold mb-2">רשימת המתנה:</h3>
                            <ul className="list-disc list-inside">
                              {workshop.waitlist.map((p, i) => (
                                <li key={i}>{p.name}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    onClick={() => handleRegister(workshop)}
                    disabled={workshop.participants.some(p => p.name === currentUser.name)}
                  >
                    <UserPlus className="h-4 w-4 ml-2" />
                    {workshop.participants.length >= workshop.maxParticipants ? 'רשימת המתנה' : 'הרשמה'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// טופס הוספת סדנה
const AddWorkshopForm = ({ onAdd }) => {
  const [newWorkshop, setNewWorkshop] = useState({
    name: "",
    instructor: "",
    date: "",
    time: "",
    maxParticipants: 20,
    description: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newWorkshop);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">שם הסדנה</label>
        <Input
          value={newWorkshop.name}
          onChange={(e) => setNewWorkshop({...newWorkshop, name: e.target.value})}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">מנחה</label>
        <Input
          value={newWorkshop.instructor}
          onChange={(e) => setNewWorkshop({...newWorkshop, instructor: e.target.value})}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">תאריך</label>
        <Input
          type="date"
          value={newWorkshop.date}
          onChange={(e) => setNewWorkshop({...newWorkshop, date: e.target.value})}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">שעה</label>
        <Input
          type="time"
          value={newWorkshop.time}
          onChange={(e) => setNewWorkshop({...newWorkshop, time: e.target.value})}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">מקסימום משתתפים</label>
        <Input
          type="number"
          value={newWorkshop.maxParticipants}
          onChange={(e) => setNewWorkshop({...newWorkshop, maxParticipants: parseInt(e.target.value)})}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">תיאור הסדנה</label>
        <Input
          value={newWorkshop.description}
          onChange={(e) => setNewWorkshop({...newWorkshop, description: e.target.value})}
        />
      </div>
      <Button type="submit" className="w-full">הוספת סדנה</Button>
    </form>
  );
};

export default MobileWorkshopManager;
[15:34, 2.11.2024] הדס דרור: import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const RetentionHeatmap = () => {
  // Sample data
  const data = [
    {"cohort":"Jan","month0":100,"month1":88.8,"month2":79.5,"month3":74.2,"month4":68.2,"month5":65.4,"month6":59.4,"totalUsers":2854},
    {"cohort":"Feb","month0":100,"month1":89.2,"month2":80.6,"month3":72.1,"month4":65.3,"month5":62.3,"month6":55.7,"totalUsers":2960}
  ];

  // Function to get color based on retention value
  const getColor = (value) => {
    // Scale from light blue to dark blue based on retention percentage
    const intensity = Math.floor((value / 100) * 255);
    return rgb(${255 - intensity}, ${255 - intensity}, 255);
  };

  // Get all month keys (month0, month1, etc.)
  const monthKeys = Object.keys(data[0])
    .filter(key => key.startsWith('month'))
    .sort((a, b) => parseInt(a.slice(5)) - parseInt(b.slice(5)));

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>User Retention Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border text-left">Cohort</th>
                <th className="p-2 border text-left">Users</th>
                {monthKeys.map((month) => (
                  <th key={month} className="p-2 border text-center">
                    Month {month.slice(5)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.cohort}>
                  <td className="p-2 border font-medium">{row.cohort}</td>
                  <td className="p-2 border text-right">{row.totalUsers.toLocaleString()}</td>
                  {monthKeys.map((month) => (
                    <td
                      key={month}
                      className="p-2 border text-center"
                      style={{
                        backgroundColor: getColor(row[month]),
                        color: row[month] > 50 ? 'white' : 'black'
                      }}
                    >
                      {row[month].toFixed(1)}%
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
