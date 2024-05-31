import Bookmarks from "@/components/widgets/Bookmarks";
import Weather from "@/components/widgets/Weather";
import Search from "@/components/widgets/Search";
import Calendar from "@/components/widgets/Calendar";
import Tasks from "@/components/widgets/Tasks";
import Dino from "@/components/widgets/Dino";

const LeftColumnWidgets = () => (
  <>
    <Calendar />
    <Weather zipCode="10001" />
  </>
);

const CenterColumnWidgets = () => (
  <>
    <Search />
    <Dino />
  </>
);

const RightColumnWidgets = () => (
  <>
    <Bookmarks
      groups={[
        {
          title: "Social",
          color: "blue",
          links: [
            { title: "Twitter", url: "https://twitter.com" },
            { title: "GitHub", url: "https://github.com" },
          ],
        },
        {
          title: "News",
          color: "green",
          links: [
            { title: "Hacker News", url: "https://news.ycombinator.com" },
            { title: "Reddit", url: "https://reddit.com" },
          ],
        },
      ]}
    />
    <Tasks />
  </>
);

export default function Home() {
  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen">
      <header className="flex items-center justify-between">
        <p className="text-2xl font-bold">Homepage</p>
      </header>
      <main className="grid grid-cols-4 gap-8 flex-grow">
        <aside className="col-span-1 flex flex-col gap-8">
          <LeftColumnWidgets />
        </aside>
        <section className="col-span-2 flex flex-col gap-8">
          <CenterColumnWidgets />
        </section>
        <aside className="col-span-1 flex flex-col gap-8">
          <RightColumnWidgets />
        </aside>
      </main>
    </div>
  );
}
