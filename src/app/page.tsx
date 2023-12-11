import AddMessage from "@/components/StandardQueryMessage/AddMessage";
import AllMessages from "@/components/StandardQueryMessage/AllMessages";
import GoToDashboardButton from "@/components/Dashboard/GoToDashboardButton";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Test from "@/components/BaseQuery/Test";
import UserData from "@/components/Auth/UserData";
import UserMessages from "@/components/StandardQueryMessage/UserMessages";
import InfQueryAllMessages from "@/components/InfiniteQueryMessage/InfQueryAllMessages";
import InfQueryAddMessage from "@/components/InfiniteQueryMessage/InfQueryAddMessage";

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
        <div className="mt-8">
          <h1 className="text-xl font-extrabold mt-12 mb-2">INFINITE QUERY!</h1>
          <InfQueryAllMessages />
        </div>
        <div className="mt-8">
          <InfQueryAddMessage />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
