import Image from "next/image";

const Spinner = () => (
  // <div className="w-6 h-6 rounded-full border-2 border-green border-t-transparent animate-spin" />
        <div className="relative w-20 h-20">
          {/* Track ring */}
          <div className="absolute inset-0 rounded-full border border-grey" />
  
          {/* Spinning arc — green top, gold right */}
          <div
            className="absolute inset-0 rounded-full border-[3px] border-transparent animate-spin"
            style={{
              borderTopColor: "#114B3A",
              borderRightColor: "#DEAF4A",
              animationDuration: "1.1s",
            }}
          />
  
          {/* Logo mark */}
          <div className="absolute inset-0 flex items-center justify-center p-3">
            <Image
              src="/logo-icon.png"
              alt="Àjọrà"
              width={44}
              height={44}
              className="object-contain"
              priority
            />
          </div>
        </div>
);

export default Spinner;