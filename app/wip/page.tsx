import { RavnIcon } from "@/components/icons";
import {
    Card, CardContent
} from "@/components/ui/card";
import { ConstructionIcon } from "lucide-react";

const Background = () => {
  return (
    <div className="absolute min-h-screen w-screen overflow-hidden -z-50 justify-center items-center">
      <div className="absolute min-h-screen w-screen -z-50 justify-center items-center">
        <div className="relative flex flex-wrap justify-center items-center">
          {[...Array(200)].map((_, index) => (
            <div
              key={index}
              className="flex-none w-10 h-10 rounded-full bg-opacity-50 transform rotate-45 m-8 opacity-5"
            >
              <RavnIcon />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Wip() {
  return (
    <main className="flex min-h-screen flex-col justify-center min-w-full align-middle items-center">
      <Background />
      <Card  className="p-5">
        <CardContent className="text-2xl flex flex-col justify-center w-full items-center text-center align-middle">
           <ConstructionIcon size={100}/>
           <div>Working in progress</div>
        </CardContent>
      </Card>
    </main>
  );
}
