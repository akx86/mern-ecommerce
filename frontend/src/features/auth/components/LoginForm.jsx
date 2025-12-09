import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { login, reset } from '../authSlice'; // استدعاء الأكشنز
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// (نفس الـ Schema زي ما هي)
const formSchema = z.object({
  email: z.string().email({ message: "بريد إلكتروني غير صحيح" }),
  password: z.string().min(6, { message: "كلمة المرور قصيرة جداً" }),
});

export function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // قراءة الستيت من Redux
  const {  isLoading, isError, message } = useSelector(
    (state) => state.auth
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (isError) {
      alert(message); // أو استخدم Toast هنا
    }
    return () => { dispatch(reset()) } // تنظيف الستيت لما نخرج من الصفحة
  }, [isError, message, dispatch]);

  function onSubmit(values) {
    dispatch(login(values))
    .unwrap()
    .then((userData)=>{
      const isAdmin = userData.isAdmin || userData.user?.isAdmin;
      if (isAdmin === true) {
           navigate('/dashboard');
        } else {
           navigate('/');
        }
    })
    .catch((error)=>{
      console.error("Login Failed:", error);
    })
    
  }

  return (
    <Card className="w-[350px] mx-auto mt-10 shadow-lg">
      <CardHeader>
        <CardTitle>تسجيل الدخول</CardTitle>
        <CardDescription>أدخل بياناتك للمتابعة</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl><Input type="password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* زرار بيتغير حالته حسب التحميل */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "جاري التحميل..." : "دخول"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}