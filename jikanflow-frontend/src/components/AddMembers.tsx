import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function AddMembers() {

    const [email, setEmail] = useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email.trim()) return alert("Please enter a valid email");

        // 🔁 TODO: Call your API to send invitation
        console.log("Sending invite to:", email);

        // optionally clear form
        setEmail("");
      };
  return (
    <>

          <Dialog>
              <form onSubmit={handleSubmit}>
                  <DialogTrigger asChild>
                      <Button variant={"default"} className="cursor-pointer">
                          Add Project
                      </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                          <DialogTitle>Add a new member</DialogTitle>
                          <DialogDescription>
                              Enter the email of the member you want to add, a request will be send to their email.
                          </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4">
                          <div className="grid gap-3">
                              <Label htmlFor="email">Email</Label>
                              <Input id="email" type="email" name="email" placeholder="pedroduarte@gmail.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
                          </div>
                      </div>
                      <DialogFooter>
                          <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button type="submit">Send</Button>
                      </DialogFooter>
                  </DialogContent>
              </form>
          </Dialog>
    </>
  )
}

export default AddMembers
