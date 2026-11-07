import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";

// ✅ Typed versions of useDispatch and useSelector
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/** True once the saved sign-in has loaded from the browser. Until then everyone looks signed out. */
export const useAuthReady = (): boolean => useAppSelector((state) => Boolean(state._persist?.rehydrated));
