import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{ minHeight: "100svh", paddingTop: "var(--nav-h)" }}
    >
      <span className="label text-[var(--accent)] mb-4">404</span>
      <h1 className="heading-xl mb-6">Page Not Found</h1>
      <p className="opacity-50 mb-10 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
