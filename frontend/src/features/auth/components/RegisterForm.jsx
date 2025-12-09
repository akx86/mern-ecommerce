import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom'; // Link عشان نوديه للوجين لو عنده حساب
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { register, reset } from '../authSlice';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

// 1. قواعد التحقق (Validation Schema)
const formSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يكون حرفين على الأقل" }),
  email: z.string().email({ message: "بريد إلكتروني غير صحيح" }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
});

export function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  useEffect(() => {
    if (isError) { alert(message); } // استبدلها بـ Toast لو تحب
    if (isSuccess || user) { navigate('/dashboard'); }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  function onSubmit(values) {
    dispatch(register(values));
  }

  return (
    <Card className="w-[350px] mx-auto mt-10 shadow-lg">
      <CardHeader>
        <CardTitle>إنشاء حساب جديد</CardTitle>
        <CardDescription>أدخل بياناتك للانضمام إلينا</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* الاسم */}
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الكامل</FormLabel>
                  <FormControl><Input placeholder="Enter your Full Name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* الإيميل */}
            <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl><Input placeholder="name@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* الباسورد */}
            <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl><Input type="password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "جاري الإنشاء..." : "تسجيل حساب"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            لديك حساب بالفعل؟ <Link to="/login" className="text-blue-600 hover:underline">سجل دخول</Link>
          </p>
      </CardFooter>
    </Card>
  );
}