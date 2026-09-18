import { useEffect, useRef, useState } from "react";
import type { GalleryAssetKind } from "@/generated/prisma";
import { listGalleryAssetsAction } from "@/lib/actions/gallery";
import type { GalleryAssetDTO } from "@/lib/gallery-asset-dto";

const PAGE_SIZE = 11;

/** Carga y pagina los assets de la galería mientras el diálogo está abierto. */
export function useGalleryPickerAssets(open: boolean, kindFilter: GalleryAssetKind) {
  const [assets, setAssets] = useState<GalleryAssetDTO[] | null>(null);
  const [page, setPage] = useState(0);
  const [prevOpen, setPrevOpen] = useState(open);
  const loadIdRef = useRef(0);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setPage(0);
  }

  useEffect(() => {
    if (!open) return;
    const id = ++loadIdRef.current;
    void listGalleryAssetsAction({ kind: kindFilter }).then((res) => {
      if (loadIdRef.current !== id) return;
      if (res.ok) setAssets(res.assets);
      else setAssets([]);
    });
  }, [open, kindFilter]);

  const totalPages = assets ? Math.max(1, Math.ceil(assets.length / PAGE_SIZE)) : 1;
  const currentPage = Math.min(page, totalPages - 1);
  const pagedAssets = assets
    ? assets.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE)
    : [];

  return { assets, setPage, currentPage, totalPages, pagedAssets };
}
