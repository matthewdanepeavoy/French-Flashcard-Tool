import React, { useState, useMemo } from "react";
import { Inertia } from "@inertiajs/inertia";
import PageWrapper from "./PageWrapper";
import Badge from "@/components/Badge";

export default function PhrasesIndex({ phrases }) {
  const [practiceList, setPracticeList] = useState(new Set());
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [sortOrder, setSortOrder] = useState("alphabetical");
  const [minCorrect, setMinCorrect] = useState(0);
    const [minErrors, setMinErrors] = useState(0);

    // collect tag and type options dynamically
    const tagOptions = useMemo(() => {
    // Include All first, then Untagged, then other tags
    const tags = Object.keys(phrases).filter((g) => g !== "Untagged");
    return ["All", "Untagged", ...tags];
    }, [phrases]);

  const typeOptions = useMemo(() => {
    const types = new Set();
    Object.values(phrases).forEach((group) => {
      if (!group) return;

      if (Array.isArray(group)) {
        group.forEach((p) => types.add(p.type));
      } else if (typeof group === "object") {
        Object.values(group).forEach((sub) => {
          if (Array.isArray(sub)) sub.forEach((p) => types.add(p.type));
        });
      }
    });
    return ["All", ...Array.from(types).sort()];
  }, [phrases]);

  // get filtered + sorted list
  const filteredPhrases = useMemo(() => {
  let list: Phrase[] = [];

  if (selectedTag === "All" || selectedTag === "Untagged") {
    // include all phrases from all groups
    Object.values(phrases).forEach((group) => {
      if (Array.isArray(group)) list = list.concat(group);
      else Object.values(group).forEach((sub) => (list = list.concat(sub)));
    });

    if (selectedTag === "Untagged") {
        list = list.filter((p) => {
            return p.tags.length === 0;
        })
    }

  } else {
    // normal tag
    list = phrases[selectedTag] || [];
  }

  if (selectedType !== "All") {
    list = list.filter((w) => w.type === selectedType);
  }

  // Sorting
  switch (sortOrder) {
    case "phrases":
      list = list.sort((a, b) => (b.phrases?.length ?? 0) - (a.phrases?.length ?? 0));
      break;
    case "correct_count":
      list = list.sort((a, b) => (b.correct_count ?? 0) - (a.correct_count ?? 0));
      break;
    case "error_count":
      list = list.sort((a, b) => (b.error_count ?? 0) - (a.error_count ?? 0));
      break;
    case "alphabetical":
    default:
      list = list.sort((a, b) => a.phrase.localeCompare(b.phrase));
      break;
  }

  return list;
}, [phrases, selectedTag, selectedType, sortOrder]);

  return (
    <PageWrapper practiceList={practiceList} setPracticeList={setPracticeList}>
      <div className="min-h-screen px-10 py-10 text-white">
        <h1 className="text-4xl font-extrabold mb-8 text-center">Phrase List</h1>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 bg-blue-950/80 p-4 rounded-xl border border-blue-800 shadow-lg">
          <select
            className="bg-blue-900 text-white rounded-md px-3 py-2"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            {tagOptions.map((tag) => (
              <option key={tag}>{tag}</option>
            ))}
          </select>

          <select
            className="bg-blue-900 text-white rounded-md px-3 py-2"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {typeOptions.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>

         <select
            className="bg-blue-900 text-white rounded-md px-3 py-2"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            >
            <option value="alphabetical">Alphabetical</option>
            <option value="words">Words</option>
            <option value="correct_count">Correct</option>
            <option value="error_count">Errors</option>
        </select>

        {/* Reset button */}
            <button
                onClick={() => {
                setSelectedTag("All");
                setSelectedType("All");
                setSortOrder("alphabetical");
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-2 rounded-md shadow"
            >
                Reset Filters
            </button>
        </div>

        <div className="mb-4 text-white font-semibold text-lg">
            {filteredPhrases.length} {filteredPhrases.length === 1 ? "phrase" : "phrases"}
        </div>

        {/* Single Column Table */}
        <div className="overflow-x-auto bg-blue-900/90 backdrop-blur-lg rounded-xl shadow-lg border border-blue-800">
          <table className="min-w-full text-sm text-left text-white">
            <thead className="bg-blue-800/90 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3">Phrase</th>
                <th className="px-4 py-3">English</th>
                <th className="px-4 py-3 text-center">Words</th>
                <th className="px-4 py-3 text-center">Level</th>
                <th className="px-4 py-3 text-center">Correct</th>
                <th className="px-4 py-3 text-center">Errors</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
           <tbody>
                {filteredPhrases.map((phrase, index) => (
                    <tr key={`${phrase.id}-${index}`}>
                    <td className="px-4 py-2 font-semibold">{phrase.phrase}</td>
                    <td className="px-4 py-2">{phrase.english}</td>
                    <td className="px-4 py-2 text-center">{phrase.words?.length ?? 0}</td>
                    <td className="px-4 py-2 text-center">{phrase.level}</td>
                    <td className="px-4 py-2 text-center">{phrase.correct_count}</td>
                    <td className="px-4 py-2 text-center">{phrase.error_count}</td>
                    <td className="px-4 py-2 text-right space-x-2">
                        <a
                          href={`/admin/words/${phrase.id}/edit`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-md px-3 py-1 rounded shadow"
                        >
                        Edit
                      </a>
                        <button
                        onClick={() => Inertia.get(`/practice?phrase_id=${phrase.id}`)}
                        className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-3 py-1 rounded"
                        >
                        Practice
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
          </table>

          {filteredPhrases.length === 0 && (
            <div className="text-center py-8 text-blue-200 italic">
              No phrases found for this filter.
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
