import { useEffect, useMemo, useState } from "react";
import { getPageContent } from "../api";

const API_BASE_FALLBACK = "http://15.206.207.118:8000";

export default function usePageContent(page) {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getPageContent(page)
      .then((res) => {
        if (active) {
          setContent(res.data);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [page]);

  const getField = useMemo(
    () =>
      (section, field = "content") => {
        const record = content.find((item) => item.section === section);
        if (!record) return "";
        if (field === "title") return record.title || "";
        if (field === "image") return record.image || "";
        return record.content || "";
      },
    [content]
  );

  const withMediaBase = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const base = process.env.REACT_APP_API_BASE_URL || API_BASE_FALLBACK;
    return `${base}${path}`;
  };

  return { content, getField, loading, error, withMediaBase };
}

