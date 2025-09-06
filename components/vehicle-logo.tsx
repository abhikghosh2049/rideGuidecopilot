export function VehicleLogo() {
  return (
    <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary-foreground"
      >
        <path
          d="M5 11L6.5 6.5H17.5L19 11M5 11V16H19V11M5 11H19M7 13.5H9M15 13.5H17M6.5 18.5H7.5M16.5 18.5H17.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="18.5" r="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="17" cy="18.5" r="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    </div>
  )
}
