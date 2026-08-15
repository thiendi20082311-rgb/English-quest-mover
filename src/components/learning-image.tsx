"use client";

import Image from "next/image";
import { useState } from "react";

export function LearningImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="learning-image">
      {!failed && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 800px) 100vw, 42vw"
          onError={() => setFailed(true)}
        />
      )}
      {failed && (
        <div className="learning-image__fallback" role="img" aria-label={alt}>
          <div>
            <span aria-hidden="true">✦</span>
            <span>{alt}</span>
          </div>
        </div>
      )}
    </div>
  );
}
