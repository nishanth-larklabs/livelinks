import { useState, useMemo, useEffect } from "react";


type Favicon = {
    url: string
    title: string
}
 

export const Favicon = ({ url, title }: Favicon) => {
  const [error, setError] = useState(false);
  
  const hostname = useMemo(() => {
    try {
      return new URL(url).hostname;
    } catch {
      return null;
    }
  }, [url]);

  useEffect(() => {
    setError(false);
  }, [url]);

  if (!hostname || error) {
    return (
      <div className="h-10 w-10 shrink-0 rounded-2xl bg-purple-50 flex items-center justify-center text-primary font-bold text-lg border border-purple-100">
        {title.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className="h-10 w-10 shrink-0 rounded-2xl bg-white p-1.5 shadow-sm border border-black/5 flex items-center justify-center">
      <img
        src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
        alt={`${title} favicon`}
        className="h-full w-full object-contain"
        onError={() => setError(true)}
      />
    </div>
  );
};