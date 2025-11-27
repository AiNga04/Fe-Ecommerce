import Image from "next/image";

import loginHero from "@/assets/images/login-hero.png";

export function LoginHero() {
  return (
    <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
      {/* Hero Image */}
      <div className="w-full max-w-md">
        <Image
          src={loginHero}
          alt="Shopping illustration"
          className="w-full h-auto"
          priority
        />
      </div>
    </div>
  );
}
