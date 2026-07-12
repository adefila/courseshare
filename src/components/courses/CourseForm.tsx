"use client";

import { useState } from "react";
import { useActionState } from "react";
import { createCourse } from "@/app/actions/courses";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

const CURRENT_YEAR = new Date().getFullYear();

const NIGERIAN_UNIVERSITIES = [
  // Federal Universities
  "Abubakar Tafawa Balewa University, Bauchi (ATBU)",
  "Ahmadu Bello University, Zaria (ABU)",
  "Federal University Birnin Kebbi (FUBK)",
  "Federal University Dutse (FUD)",
  "Federal University Dutsin-Ma (FUDMA)",
  "Federal University Gashua",
  "Federal University Gusau",
  "Federal University Kashere (FUKASHERE)",
  "Federal University Lafia (FULAFIA)",
  "Federal University Lokoja (FULOKOJA)",
  "Federal University Ndufu-Alike Ikwo (FUNAI)",
  "Federal University of Agriculture, Abeokuta (FUNAAB)",
  "Federal University of Agriculture, Makurdi (UAM)",
  "Federal University of Health Sciences, Ila-Orangun",
  "Federal University of Health Sciences, Otukpo",
  "Federal University of Petroleum Resources, Effurun (FUPRE)",
  "Federal University of Technology, Akure (FUTA)",
  "Federal University of Technology, Babura",
  "Federal University of Technology, Ikot Abasi",
  "Federal University of Technology, Minna (FUTMINNA)",
  "Federal University of Technology, Owerri (FUTO)",
  "Federal University Otuoke",
  "Federal University Oye-Ekiti (FUOYE)",
  "Federal University Wukari",
  "Michael Okpara University of Agriculture, Umudike (MOUAU)",
  "Modibbo Adama University, Yola (MAU)",
  "National Open University of Nigeria (NOUN)",
  "Nigerian Defence Academy, Kaduna (NDA)",
  "Nnamdi Azikiwe University, Awka (UNIZIK)",
  "Obafemi Awolowo University, Ile-Ife (OAU)",
  "University of Abuja",
  "University of Benin (UNIBEN)",
  "University of Calabar (UNICAL)",
  "University of Ibadan (UI)",
  "University of Ilorin (UNILORIN)",
  "University of Jos (UNIJOS)",
  "University of Lagos (UNILAG)",
  "University of Maiduguri (UNIMAID)",
  "University of Nigeria, Nsukka (UNN)",
  "University of Port Harcourt (UNIPORT)",
  "University of Uyo (UNIUYO)",
  "Usmanu Danfodiyo University, Sokoto (UDUS)",
  // State Universities
  "Abia State University, Uturu (ABSU)",
  "Adamawa State University, Mubi",
  "Adekunle Ajasin University, Akungba-Akoko (AAUA)",
  "Akwa Ibom State University (AKSU)",
  "Ambrose Alli University, Ekpoma (AAU)",
  "Anambra State University (ANSU)",
  "Benue State University, Makurdi (BSU)",
  "Borno State University, Maiduguri",
  "Cross River State University of Technology (CRUTECH)",
  "Delta State University, Abraka (DELSU)",
  "Ebonyi State University, Abakaliki (EBSU)",
  "Ekiti State University (EKSU)",
  "Enugu State University of Science and Technology (ESUT)",
  "Gombe State University (GSU)",
  "Ibrahim Badamasi Babangida University, Lapai (IBBU)",
  "Ignatius Ajuru University of Education, Port Harcourt",
  "Imo State University, Owerri (IMSU)",
  "Kaduna State University (KASU)",
  "Kano University of Science and Technology (KUST)",
  "Kebbi State University of Science and Technology (KSUSTA)",
  "Kogi State University (KSU)",
  "Kwara State University, Malete (KWASU)",
  "Lagos State University (LASU)",
  "Ladoke Akintola University of Technology, Ogbomoso (LAUTECH)",
  "Nasarawa State University, Keffi",
  "Niger Delta University, Wilberforce Island (NDU)",
  "Ondo State University of Science and Technology (OSUSTECH)",
  "Osun State University (UNIOSUN)",
  "Plateau State University, Bokkos",
  "Rivers State University, Port Harcourt (RSU)",
  "Sokoto State University",
  "Tai Solarin University of Education (TASUED)",
  "Taraba State University, Jalingo",
  "Umar Musa Yar'adua University, Katsina (UMYU)",
  "Yobe State University, Damaturu",
  "Zamfara State University",
  // Private Universities
  "African University of Science and Technology, Abuja (AUST)",
  "Achievers University, Owo",
  "Adeleke University, Ede",
  "Afe Babalola University, Ado-Ekiti (ABUAD)",
  "Al-Hikmah University, Ilorin",
  "Al-Qalam University, Katsina",
  "American University of Nigeria, Yola (AUN)",
  "Augustine University, Ilara-Epe",
  "Babcock University, Ilishan-Remo",
  "Baze University, Abuja",
  "Bells University of Technology, Ota",
  "Benson Idahosa University, Benin City",
  "Bowen University, Iwo",
  "Caleb University, Lagos",
  "Chrisland University, Abeokuta",
  "Covenant University, Ota",
  "Crawford University, Igbesa",
  "Crescent University, Abeokuta",
  "Dominican University, Ibadan",
  "Edwin Clark University, Kiagbodo",
  "Elizade University, Ilara-Mokin",
  "Fountain University, Osogbo",
  "Godfrey Okoye University, Enugu",
  "Hallmark University, Ijebu-Itele",
  "Hezekiah University, Umudi",
  "Igbinedion University, Okada",
  "Joseph Ayo Babalola University, Ikeji-Arakeji (JABU)",
  "Kings University, Ode-Omu",
  "Kwararafa University, Wukari",
  "Landmark University, Omu-Aran",
  "Lead City University, Ibadan",
  "Madonna University, Okija",
  "McPherson University, Seriki-Sotayo",
  "Mountain Top University, Lagos",
  "Nile University of Nigeria, Abuja",
  "Novena University, Ogume",
  "Oduduwa University, Ipetumodu",
  "Pan-Atlantic University, Lagos (PAU)",
  "Redeemer's University, Ede",
  "Renaissance University, Ugbawka",
  "Rhema University, Aba",
  "Ritman University, Ikot Ekpene",
  "Salem University, Lokoja",
  "Samuel Adegboyega University, Ogwa",
  "Southwestern University, Oku-Owa",
  "Spiritan University, Nneochi",
  "Tansian University, Umunya",
  "Veritas University, Abuja",
  "Wesley University, Ondo",
  "Western Delta University, Oghara",
  // Polytechnics
  "Yaba College of Technology (YABATECH)",
  "Federal Polytechnic, Ado-Ekiti",
  "Federal Polytechnic, Bida",
  "Federal Polytechnic, Daura",
  "Federal Polytechnic, Ede",
  "Federal Polytechnic, Idah",
  "Federal Polytechnic, Ile-Oluji",
  "Federal Polytechnic, Ilaro",
  "Federal Polytechnic, Mubi",
  "Federal Polytechnic, Nasarawa",
  "Federal Polytechnic, Nekede",
  "Federal Polytechnic, Offa",
  "Federal Polytechnic, Oko",
  "Federal Polytechnic, Ukana",
  "Auchi Polytechnic",
  "Kaduna Polytechnic",
  "Kano State Polytechnic",
  "Kwara State Polytechnic",
  "Lagos State Polytechnic (LASPOTECH)",
  "Rivers State Polytechnic, Bori",
  "The Polytechnic, Ibadan",
].sort();

function UniversityCombobox() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const suggestions =
    query.trim().length >= 1
      ? NIGERIAN_UNIVERSITIES.filter((u) =>
          u.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8)
      : [];

  return (
    <div className="relative">
      <input
        name="university"
        required
        value={query}
        autoComplete="off"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (query.trim().length >= 1) setOpen(true);
        }}
        onBlur={() => setOpen(false)}
        placeholder="Search or type your university…"
        className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 z-50 mt-1 max-h-52 overflow-auto rounded-xl border border-zinc-200 bg-white py-1 text-sm shadow-lg">
          {suggestions.map((u) => (
            <li
              key={u}
              onMouseDown={(e) => {
                e.preventDefault();
                setQuery(u);
                setOpen(false);
              }}
              className="cursor-pointer px-3.5 py-2.5 text-zinc-700 hover:bg-indigo-50 hover:text-indigo-700"
            >
              {u}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function CourseForm() {
  const [state, action, isPending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return await createCourse(formData);
    },
    null
  );

  return (
    <form action={action} className="flex flex-col gap-5">
      <Input
        id="course_name"
        name="course_name"
        label="Course name *"
        placeholder="Introduction to Computer Science"
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="course_code"
          name="course_code"
          label="Course code *"
          placeholder="COMP101"
          required
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="university" className="font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            University *
          </label>
          <UniversityCombobox />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="semester" className="font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            Semester *
          </label>
          <div className="relative">
            <select
              id="semester"
              name="semester"
              required
              className="w-full appearance-none rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-zinc-900 transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">Select…</option>
              <option value="1st Semester">1st Semester</option>
              <option value="2nd Semester">2nd Semester</option>
              <option value="Harmattan">Harmattan</option>
              <option value="Rain">Rain</option>
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
        <Input
          id="year"
          name="year"
          label="Year *"
          type="number"
          min={2000}
          max={2100}
          defaultValue={CURRENT_YEAR}
          required
        />
      </div>
      <Textarea
        id="description"
        name="description"
        label="Description (optional)"
        placeholder="Brief overview of what this course covers…"
        rows={3}
      />

      {state?.error && (
        <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={isPending} size="lg">
        {isPending ? "Creating…" : "Create course"}
      </Button>
    </form>
  );
}
