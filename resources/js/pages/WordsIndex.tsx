import React, { useState, useMemo } from "react";
import { Inertia } from "@inertiajs/inertia";
import PageWrapper from "./PageWrapper";
import Badge from "@/components/Badge";
import { router } from "@inertiajs/react";

export default function WordsIndex({ words }) {
  const [practiceList, setPracticeList] = useState(new Set());
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [sortOrder, setSortOrder] = useState("alphabetical");

  // collect tag and type options dynamically
  const tagOptions = useMemo(() => {
    return ["All", "Untagged", ...Object.keys(words).filter((g) => g !== "Untagged")];
  }, [words]);

  const typeOptions = useMemo(() => {
    const types = new Set();
    Object.values(words).forEach((group) => {
        if (!group) return;

        // Some groups are arrays (tag groups), some are objects (Untagged subgroups)
        if (Array.isArray(group)) {
            group.forEach((w) => types.add(w.type));
        } else if (typeof group === "object") {
            Object.values(group).forEach((sub) => {
            if (Array.isArray(sub)) {
                sub.forEach((w) => types.add(w.type));
            }
            });
        }
        });
    return ["All", ...Array.from(types).sort().filter((type) => {
      return type;
    })];
  }, [words]);

  // get filtered + sorted list
  const filteredWords = useMemo(() => {
    let list = [];

    if (selectedTag === "All" || selectedTag === 'Untagged') {
      Object.values(words).forEach((group) => {
        if (group && typeof group === "object" && !Array.isArray(group)) {
          Object.values(group).forEach((wlist) => (list = list.concat(wlist)));
        } else if (Array.isArray(group)) {
          list = list.concat(group);
        }
      });


      if (selectedTag === "Untagged") {
          list = list.filter((p) => {
              return p.tags.length === 0;
          })
      }
    } else {
      list = words[selectedTag] || [];
    }

    if (selectedType !== "All") {
      list = list.filter((w) => w.type === selectedType);
    }

    if (sortOrder === "phrases") {
      list = list.sort((a, b) => b.phrases.length - a.phrases.length);
    } else {
      list = list.sort((a, b) => a.word.localeCompare(b.word));
    }

    return list;
  }, [words, selectedTag, selectedType, sortOrder]);

  // split words into two balanced columns
  const mid = Math.ceil(filteredWords.length / 2);
  const col1 = filteredWords.slice(0, mid);
  const col2 = filteredWords.slice(mid);

  return (
    <PageWrapper practiceList={practiceList} setPracticeList={setPracticeList}>
      <div className="min-h-screen px-10 py-10 text-white">
        <h1 className="text-4xl font-extrabold mb-8 text-center">Word List</h1>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 bg-blue-950/80 p-4 rounded-xl border border-blue-800 shadow-lg">
          <select
            className="bg-blue-900 text-white rounded-md px-3 py-2"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            {tagOptions.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          <select
            className="bg-blue-900 text-white rounded-md px-3 py-2"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            className="bg-blue-900 text-white rounded-md px-3 py-2"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="alphabetical">Alphabetical</option>
            <option value="phrases">Most Phrases</option>
          </select>

            <button
                onClick={() => {
                setSelectedTag("All");
                setSelectedType("All");
                setSortOrder("alphabetical");
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-3 py-2 rounded-md shadow"
            >
                Reset
            </button>
        </div>

        <div className="mb-4 text-white font-semibold text-lg">
            {filteredWords.length} {filteredWords.length === 1 ? "word" : "words"}
        </div>

        {/* Table area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[col1, col2].map((col, idx) => (
            <div
              key={idx}
              className="overflow-x-auto bg-blue-900/90 backdrop-blur-lg rounded-xl shadow-lg border border-blue-800"
            >
              <table className="min-w-full text-sm text-left text-white">
                <thead className="bg-blue-800/90 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Word</th>
                    <th className="px-4 py-3">Definition</th>
                    <th className="px-4 py-3 text-center">Phrases</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-700/60">
                  {col.map((word) => (
                    <TableRow key={word.id} word={word} />
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

function TableRow({word}) {
  const [practice, setPractice] = useState(word.to_practice);

  return(
    <tr
      key={word.id}
      className="hover:bg-blue-800/50 transition-colors"
    >
      <td className="px-4 py-2 font-semibold">{word.word}</td>
      <td className="px-4 py-2 opacity-80">
        {word.definition ?? "—"}
      </td>
      <td className="px-4 py-2 text-center">
        {word.phrases?.length ?? 0}
      </td>
      <td className="px-4 py-2 text-right space-x-2">
          <a
            href={`/admin/words/${word.id}/edit`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-md px-3 py-1 rounded shadow"
          >
          Edit
        </a>

        <button
          onClick={() => {
            router.post(
                route('toggle.practice'),
                {
                    model_id: word.id, model_type: 'word'
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: page => {
                      setPractice( ! practice);
                    }
                }
            );
          }}
          className={`text-white font-semibold text-xs px-3 py-1 rounded ${practice ? 'bg-red-700 hover:bg-red-800': 'bg-blue-700 hover:bg-blue-800'}`}
        >
          {practice ? 'Remove': 'Practice'}
        </button>
      </td>
    </tr>
  )
}
