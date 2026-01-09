import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerifyRequest {
  email: string;
  code: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code }: VerifyRequest = await req.json();

    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: "Email and code are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check for valid verification code
    const { data: verificationData, error: fetchError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .single();

    if (fetchError || !verificationData) {
      console.log("Invalid verification code for email:", email);
      return new Response(
        JSON.stringify({ valid: false, error: "رمز التحقق غير صحيح" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if code has expired
    const expiresAt = new Date(verificationData.expires_at);
    if (expiresAt < new Date()) {
      // Delete expired code
      await supabase
        .from("verification_codes")
        .delete()
        .eq("id", verificationData.id);

      return new Response(
        JSON.stringify({ valid: false, error: "انتهت صلاحية رمز التحقق" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Mark as verified
    await supabase
      .from("verification_codes")
      .update({ verified: true })
      .eq("id", verificationData.id);

    console.log("Verification successful for email:", email);

    return new Response(
      JSON.stringify({ valid: true, message: "تم التحقق بنجاح" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in verify-code function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
