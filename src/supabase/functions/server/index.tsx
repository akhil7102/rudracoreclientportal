import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-37c26183/health", (c) => {
  return c.json({ status: "ok" });
});

// Helper function to verify authentication
async function verifyAuth(authHeader: string | null) {
  if (!authHeader) {
    return { error: "No authorization header", user: null };
  }
  
  const accessToken = authHeader.split(' ')[1];
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user) {
    return { error: "Invalid token", user: null };
  }
  
  return { error: null, user };
}

// Register endpoint
app.post("/make-server-37c26183/register", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        role: 'client' // All registered users are clients
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.log('Registration error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log('Error in register endpoint:', error);
    return c.json({ error: "Registration failed" }, 500);
  }
});

// Submit project request endpoint
app.post("/make-server-37c26183/projects", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error || !authResult.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const { projectName, description, uiLevel, price } = await c.req.json();
    
    if (!projectName || !description || !uiLevel || !price) {
      return c.json({ error: "All fields are required" }, 400);
    }
    
    const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const project = {
      id: projectId,
      userId: authResult.user.id,
      clientEmail: authResult.user.email,
      clientName: authResult.user.user_metadata?.name || 'Unknown',
      projectName,
      description,
      uiLevel,
      price,
      paymentStatus: 'paid', // Simulated payment
      progress: 0,
      status: 'pending', // pending, in-progress, completed, declined
      createdAt: new Date().toISOString()
    };
    
    await kv.set(projectId, project);
    
    return c.json({ success: true, project });
  } catch (error) {
    console.log('Error in project submission:', error);
    return c.json({ error: "Failed to submit project" }, 500);
  }
});

// Get user's projects
app.get("/make-server-37c26183/projects/user", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error || !authResult.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const allProjects = await kv.getByPrefix('project_');
    const userProjects = allProjects.filter((p: any) => p.userId === authResult.user?.id);
    
    return c.json({ projects: userProjects });
  } catch (error) {
    console.log('Error fetching user projects:', error);
    return c.json({ error: "Failed to fetch projects" }, 500);
  }
});

// Get all projects (admin only)
app.get("/make-server-37c26183/projects/all", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error || !authResult.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    // Check if user is the hardcoded admin
    if (authResult.user.email !== 'admin@rudracore.com') {
      return c.json({ error: "Admin access required" }, 403);
    }
    
    const allProjects = await kv.getByPrefix('project_');
    
    return c.json({ projects: allProjects });
  } catch (error) {
    console.log('Error fetching all projects:', error);
    return c.json({ error: "Failed to fetch projects" }, 500);
  }
});

// Update project status (admin only)
app.put("/make-server-37c26183/projects/:id", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error || !authResult.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    // Check if user is the hardcoded admin
    if (authResult.user.email !== 'admin@rudracore.com') {
      return c.json({ error: "Admin access required" }, 403);
    }
    
    const projectId = c.req.param('id');
    const { status, progress } = await c.req.json();
    
    const project = await kv.get(projectId);
    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }
    
    const updatedProject = {
      ...project,
      ...(status && { status }),
      ...(progress !== undefined && { progress })
    };
    
    await kv.set(projectId, updatedProject);
    
    return c.json({ success: true, project: updatedProject });
  } catch (error) {
    console.log('Error updating project:', error);
    return c.json({ error: "Failed to update project" }, 500);
  }
});

// Create order endpoint
app.post("/make-server-37c26183/orders", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error || !authResult.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const { serviceId, serviceName, price, customNotes, lifetimeUpdates } = await c.req.json();
    
    if (!serviceId || !serviceName || !price) {
      return c.json({ error: "Service details are required" }, 400);
    }
    
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const order = {
      id: orderId,
      userId: authResult.user.id,
      clientEmail: authResult.user.email,
      clientName: authResult.user.user_metadata?.name || 'Unknown',
      serviceId,
      serviceName,
      price,
      customNotes: customNotes || '',
      lifetimeUpdates: lifetimeUpdates || false,
      paymentStatus: 'paid', // Mock payment
      progress: 0,
      status: 'pending', // pending, in-progress, completed, cancelled
      createdAt: new Date().toISOString()
    };
    
    await kv.set(orderId, order);
    
    return c.json({ success: true, order });
  } catch (error) {
    console.log('Error creating order:', error);
    return c.json({ error: "Failed to create order" }, 500);
  }
});

// Get user's orders
app.get("/make-server-37c26183/orders/user", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error || !authResult.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const allOrders = await kv.getByPrefix('order_');
    const userOrders = allOrders.filter((o: any) => o.userId === authResult.user?.id);
    
    return c.json({ orders: userOrders });
  } catch (error) {
    console.log('Error fetching user orders:', error);
    return c.json({ error: "Failed to fetch orders" }, 500);
  }
});

// Create support ticket endpoint
app.post("/make-server-37c26183/tickets", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error || !authResult.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const { subject, category, message, contact } = await c.req.json();
    
    if (!subject || !category || !message || !contact) {
      return c.json({ error: "All fields including contact information are required" }, 400);
    }
    
    const ticketId = `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const ticket = {
      id: ticketId,
      userId: authResult.user.id,
      clientEmail: authResult.user.email,
      clientName: authResult.user.user_metadata?.name || 'Unknown',
      subject,
      category,
      message,
      contact, // email or mobile number provided by user
      status: 'open', // open, in-progress, resolved, closed
      createdAt: new Date().toISOString()
    };
    
    await kv.set(ticketId, ticket);
    
    return c.json({ success: true, ticket });
  } catch (error) {
    console.log('Error creating ticket:', error);
    return c.json({ error: "Failed to create ticket" }, 500);
  }
});

// Get user's tickets
app.get("/make-server-37c26183/tickets/user", async (c) => {
  try {
    const authResult = await verifyAuth(c.req.header('Authorization'));
    if (authResult.error || !authResult.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const allTickets = await kv.getByPrefix('ticket_');
    const userTickets = allTickets.filter((t: any) => t.userId === authResult.user?.id);
    
    return c.json({ tickets: userTickets });
  } catch (error) {
    console.log('Error fetching user tickets:', error);
    return c.json({ error: "Failed to fetch tickets" }, 500);
  }
});

Deno.serve(app.fetch);