"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import {
	createContext,
	useContext,
	useMemo,
	useState,
	useRef,
	type ReactNode,
	useCallback,
} from "react";

interface CaptchaContextType {
	captchaToken: string;
	setCaptchaToken: (token: string) => void;
	resetCaptcha: () => void;
	setResetCaptcha: (resetFn: () => void) => void;
}

const CaptchaContext = createContext<CaptchaContextType | undefined>(undefined);

export const useCaptcha = () => {
	const context = useContext(CaptchaContext);
	if (!context) {
		throw new Error("useCaptcha must be used within a CaptchaProvider");
	}
	return context;
};

export function Captcha({
	invisible = false,
}: { readonly invisible?: boolean }) {
	const ref = useRef<TurnstileInstance>(null);
	const { setCaptchaToken, setResetCaptcha } = useCaptcha();

	useMemo(() => {
		setResetCaptcha(() => () => ref.current?.reset());
	}, [setResetCaptcha]);

	const onSuccess = useCallback(
		(token: string) => {
			setCaptchaToken(token);
		},
		[setCaptchaToken],
	);

	const onExpire = useCallback(() => {
		ref.current?.reset();
	}, []);

	if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
		return null;
	}

	return (
		<Turnstile
			ref={ref}
			className={(invisible && "hidden") || ""}
			siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
			onSuccess={onSuccess}
			onExpire={onExpire}
		/>
	);
}

export const CaptchaProvider = ({ children }: { children: ReactNode }) => {
	const [captchaToken, setCaptchaToken] = useState<string>("");
	const [resetCaptcha, setResetCaptcha] = useState<() => void>(() => {/* noop */});

	const value = useMemo(
		() => ({
			captchaToken,
			setCaptchaToken,
			resetCaptcha,
			setResetCaptcha,
		}),
		[captchaToken, resetCaptcha],
	);

	return (
		<CaptchaContext.Provider value={value}>{children}</CaptchaContext.Provider>
	);
};
