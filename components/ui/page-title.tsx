export default function PageTitle({ title }: { title: string }) {
  return (
    <h1 className="text-2xl font-bold">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5046E4] to-[#8C7DFF]">
        {title}
      </span>
    </h1>
  );
}
