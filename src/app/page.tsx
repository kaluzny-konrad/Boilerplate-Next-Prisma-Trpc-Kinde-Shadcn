import AddMessage from "@/components/AddMessage";
import AllMessages from "@/components/AllMessages";
import Test from "@/components/Test";
import UserData from "@/components/UserData";

export default function Home() {
  return (
    <main>
      <div className="mt-8">
        <Test />
      </div>
      <div className="mt-8">
        <UserData />
      </div>
      <div className="mt-8">
        <AllMessages />
      </div>
      <div className="mt-8">
        <AddMessage />
      </div>
    </main>
  );
}
