export type Patient = {
  id: string;
  name: string;
  gender: string;
  age: string;
  dob: string;
  email: string;
  phone: string;
  registered: string;
};

export const PATIENTS: Patient[] = [
  {
    id: "p1",
    name: "Karl Heinz",
    gender: "Männlich",
    age: "28 Jahre",
    dob: "1997-02-10",
    email: "karl.heinz@gmail.com",
    phone: "+49 111 222 333",
    registered: "Registriert seit 27.07.2024",
  },
  {
    id: "p2",
    name: "Jürgen Hoffner",
    gender: "Männlich",
    age: "41 Jahre",
    dob: "1983-11-04",
    email: "juergen.hoffner@gmail.com",
    phone: "+49 222 333 444",
    registered: "Registriert seit 15.03.2024",
  },
  {
    id: "p3",
    name: "Lukas Schneider",
    gender: "Männlich",
    age: "25 Jahre",
    dob: "1999-06-21",
    email: "lukas.schneider@gmail.com",
    phone: "+49 333 444 555",
    registered: "Registriert seit 02.01.2025",
  },
  {
    id: "p4",
    name: "Lea Wagner",
    gender: "Weiblich",
    age: "23 Jahre",
    dob: "2001-09-14",
    email: "lea.wagner@gmail.com",
    phone: "+49 444 555 666",
    registered: "Registriert seit 18.02.2025",
  },
  {
    id: "p5",
    name: "Johanna Fischer",
    gender: "Weiblich",
    age: "35 Jahre",
    dob: "1989-04-30",
    email: "johanna.fischer@gmail.com",
    phone: "+49 555 666 777",
    registered: "Registriert seit 10.08.2023",
  },
  {
    id: "p6",
    name: "Thomas Müller",
    gender: "Männlich",
    age: "46 Jahre",
    dob: "1978-12-02",
    email: "thomas.mueller@gmail.com",
    phone: "+49 666 777 888",
    registered: "Registriert seit 01.06.2023",
  },
];

export function getPatientById(id: string): Patient | undefined {
  return PATIENTS.find((p) => p.id === id);
}
