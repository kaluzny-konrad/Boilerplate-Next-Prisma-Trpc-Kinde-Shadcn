import AddMessage from "@/components/AddMessage";
import AllMessages from "@/components/AllMessages";
import GoToDashboardButton from "@/components/GoToDashboardButton";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Test from "@/components/Test";
import UserData from "@/components/UserData";
import UserMessages from "@/components/UserMessages";

export default function Home() {
  return (
    <MaxWidthWrapper>
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
        <div className="mt-8">
          <GoToDashboardButton />
        </div>
        <div className="mt-8">
          <UserMessages />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
