import { useEffect, useRef, useState } from "react";
import { FlatList } from "react-native";
import { useRouter } from "expo-router";

export const useOnboarding = (flatListRef: React.RefObject<FlatList>, dataLength: number) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const autoSlideTimer = useRef<NodeJS.Timeout | null>(null);

  const startAutoSlide = () => {
    autoSlideTimer.current = setInterval(() => {
      setCurrentPage((prev) => {
        const next = prev < dataLength - 1 ? prev + 1 : prev;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3000);
  };

  const stopAutoSlide = () => {
    if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
  };

  const resetAutoSlide = () => {
    stopAutoSlide();
    startAutoSlide();
  };

  const handleNext = () => {
    if (currentPage === dataLength - 1) {
      router.replace("/rate_us");
    } else {
      const next = currentPage + 1;
      setCurrentPage(next);
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      resetAutoSlide();
    }
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  return {
    currentPage,
    setCurrentPage,
    handleNext,
    resetAutoSlide,
  };
};
