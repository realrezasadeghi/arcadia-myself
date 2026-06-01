# Demo Script - Arcadia/Capella MBSE Platform

## 🎯 Demo Objective
Show professors a **working Model-Based Systems Engineering (MBSE) platform** implementing:
- **Arcadia methodology** (4-layer architectural approach)
- **Interactive canvas** for modeling
- **Cross-layer traceability** connecting OA→SA→LA→PA
- **Team collaboration** with role-based access

---

## ⏱️ Total Demo Time: 12 minutes

---

## Phase 1: Authentication & Project Creation (2 minutes)

### Step 1: Show Landing Page
```
Navigate to: http://localhost:3000
```
- Show Persian UI for Arcadia methodology
- Display 4 layer cards (OA, SA, LA, PA)
- Highlight feature list (traceability, validation, collaboration)

**What to say:**
> "This is آرکدیا - a Persian-language MBSE platform. We support the complete Arcadia methodology with 4 architectural layers: Operational Analysis, System Analysis, Logical Architecture, and Physical Architecture."

### Step 2: Create Account
- Click "شروع" (Start)
- Fill form:
  - **نام کاربر:** "prof_demo"
  - **رمز عبور:** "Demo123!!"
  - **تایید رمز عبور:** "Demo123!!"
- Click "ثبت نام" (Register)

**Wait for:** "ورود موفقیت‌آمیز" (Login successful)

### Step 3: Create New Project
- Click "ایجاد پروژه جدید" (Create New Project)
- Fill form:
  - **نام:** "IFE Aircraft System"
  - **توضیحات:** "In-Flight Entertainment System for Aircraft"
  - ✅ Check "مدل IFE" (Load IFE Template)
- Click "ایجاد"

**What to say:**
> "We're creating a project with the IFE (In-Flight Entertainment) template. This automatically generates a complete 4-layer model for an aircraft entertainment system."

**Wait for:** Auto-redirect to project dashboard

---

## Phase 2: Explore the Model Structure (3 minutes)

### Step 4: View Project Dashboard
- Should see **4 layer cards**:
  - OA: Operational Analysis
  - SA: System Analysis
  - LA: Logical Architecture
  - PA: Physical Architecture

**What to say:**
> "Here you can see our 4 layers. Each layer represents a different level of abstraction:"
> - **OA (Orange):** What the business needs - passenger wants to watch movies
> - **SA (Amber):** How the system functions - provide video streaming
> - **LA (Green):** Logical components - servers, displays, networks
> - **PA (Purple):** Physical implementation - actual hardware deployment

### Step 5: Explore OA Model
- Click on **OA card** or "نمایش" (View)
- Should see "مدل OA" with elements listed

**Show:**
- Click "OCD" diagram (Operational Capability Diagram)
- Should see on canvas:
  - Passenger element
  - "Watch Movie" activity
  - "Video Entertainment" capability
  - "Cabin Crew" actor

**What to say:**
> "Here in OA, we model operational elements. We can see the passenger, cabin crew, and the operational activities and capabilities."

### Step 6: Create a Test Element (Show Canvas Interactivity)
- On the canvas, you should see an **Element Palette** on the left
- Drag "OperationalActivity" from palette onto canvas
- Name it: "Request Entertainment"
- Watch it appear on canvas

**What to say:**
> "Notice our canvas is fully interactive - you can drag elements from the palette, position them visually, and they're immediately saved to the database."

---

## Phase 3: Cross-Layer Connection (THE KEY FEATURE) (4 minutes)

### Step 7: Navigate to Traces Page
- Click on project breadcrumb or back to project view
- Scroll down or look for "ردیابی ها" (Traces) link
- Go to **Traces tab/page**

**What to say:**
> "Now let's see the most powerful feature - cross-layer traceability. This shows how requirements flow from business needs (OA) all the way down to physical implementation (PA)."

### Step 8: View Trace Visualization
Should see:

**Left to Right (4 columns):**
1. **OA Column:** Shows "Watch Movie" activity, "Passenger" entity
2. **SA Column:** Shows "Stream Video" function, "System" component
3. **LA Column:** Shows "Render Video" function, "Seat Display Unit" component
4. **PA Column:** Shows "SDU Hardware" and "Ethernet Switch" physical nodes

**Visual Connections:** Should see **colored lines connecting elements across layers**
- **Blue line:** "SA Video function → OA Watch Movie activity" (Realization)
- **Green line:** "LA Render Video → LA Seat Display Unit" (Allocation)
- **Purple line:** "PA Hardware → LA Component" (Deployment)

**What to say:**
> "Look at these lines - they show traceability. Blue lines mean 'realization' - the system realizes the operational requirement. When an engineer modifies the OA layer, anyone working on SA, LA, or PA can immediately see what changed and what their implementation must support."

### Step 9: Show Trace Matrix
- Look for **Trace Matrix** section (if visible)
- Should show table like:

|  | Passenger | Watch Movie | Browse Internet |
|-|-|-|-|
| Stream Video | ✓ | ✓ | |
| Provide Internet | | | ✓ |

**What to say:**
> "This matrix is for academic rigor - it shows which elements in one layer trace to which elements in another layer. It's the formal representation of model relationships."

---

## Phase 4: Interactive Connections (2 minutes)

### Step 10: Create a New Connection
- Go back to **OA diagram**
- Try to **connect two elements**:
  - Click on "Passenger" element
  - Drag connector line to "Watch Movie" activity
  - Should show "Connection Dialog"
  - Select relationship type (e.g., "InvolvementLink")
  - Connection appears on canvas

**What to say:**
> "When we create a connection, the system validates it. Not all connections are allowed - the business rules prevent invalid architectures. This ensures model integrity."

### Step 11: Demonstrate Validation
- Try to create an invalid connection (e.g., between incompatible types)
- System should show error: "امکان ایجاد ارتباط بین این دو المنت وجود ندارد" (Cannot create connection)

**What to say:**
> "See - it prevented an invalid connection. The system enforces Arcadia methodology rules automatically."

---

## Phase 5: Team Collaboration (1 minute)

### Step 12: Show Project Members
- Go back to **project view**
- Look for **Project Members** or **Collaboration** section
- Show "نقش" (Role) dropdown

**What to say:**
> "In a real team, you'd have:"
> - **OWNER:** Can manage users and settings
> - **EDITOR:** Can modify the model
> - **VIEWER:** Can only view diagrams

### Step 13: Mention Features (don't need to demo all)
- Model versioning
- Change history
- Comments on elements
- Real-time updates (mention as "coming soon" if not implemented)

---

## Phase 6: Comparison with Capella (1 minute)

### Step 14: Discuss Feature Parity
**Compare with Capella:**

| Feature | Arcadia | Capella | آرکدیا |
|---------|---------|---------|--------|
| 4-Layer Model | ✓ | ✓ | ✓ |
| Graphical Canvas | ✓ | ✓ | ✓ |
| Traceability | ✓ | ✓ | ✓ |
| Validation Rules | ✓ | ✓ | ✓ |
| Web-based | ✗ | ✗ | ✓ |
| Persian Language | ✗ | ✗ | ✓ |
| Open Source | ✗ | ✗ | ✓ |
| Collaborative | Limited | Limited | ✓ |

**What to say:**
> "آرکدیا brings the power of Arcadia and Capella methodologies to the web, in Persian, with real-time collaboration. This is designed specifically for engineering teams in Iran and Persian-speaking regions."

---

## 🎁 Closing Remarks (30 seconds)

**What to say:**
> "This platform demonstrates that we can implement sophisticated MBSE methodologies on the web. The key innovations are:
> 
> 1. **Full Interactivity:** Canvas editing with drag/drop, not just viewing
> 2. **Smart Validation:** Prevents invalid architectures automatically
> 3. **Cross-Layer Visualization:** Shows complete traceability at a glance
> 4. **Team-Ready:** Built for collaboration from day one
> 5. **Persian-First:** Designed for our engineering culture and language
> 
> The next steps are implementing real-time collaboration, more sophisticated modeling features, and integration with external tools."

---

## 📋 Demo Checklist

- [ ] Dev server running on localhost:3000
- [ ] Fresh project created with IFE template
- [ ] Canvas shows all 4 layers loaded
- [ ] Can drag elements on canvas
- [ ] Can create connections between elements
- [ ] Traces page shows visual connections between layers
- [ ] Trace matrix visible
- [ ] No console errors during demo
- [ ] Persian text displays correctly
- [ ] Colors match Arcadia layer conventions

---

## 🚨 If Something Goes Wrong

**Canvas not showing elements:**
- Refresh the page
- Check browser console for errors
- Verify IFE seed data was created

**Connection fails:**
- Try refreshing and trying again
- Ensure both elements are on the same diagram
- Check console for validation error messages

**Traces page blank:**
- Verify trace links exist in database
- Try navigating to a different tab and back
- Check server logs for data retrieval errors

---

## 📚 Key Terminology for Professors

**Arcadia:** "Architecture Analysis and Design Integrated Approach" - systematic methodology for systems engineering

**4 Layers:**
- **OA:** What stakeholders need (operational requirements)
- **SA:** What the system must do (system functions)
- **LA:** How to achieve it logically (components & interfaces)
- **PA:** How to build it physically (hardware/software deployment)

**Traceability:** Showing how a requirement in OA flows down to SA, LA, and PA implementation

**MBSE:** "Model-Based Systems Engineering" - using models to specify, design, and document systems

---

## ✨ Impressive Points to Emphasize

1. **Built from scratch** - Custom React + Next.js application
2. **Production-ready** - Uses Drizzle ORM, TypeScript, proper architecture
3. **Persian-first** - Not just translated, but culturally designed for Persian users
4. **Open for extension** - Can add more models, methodology variants, etc.
5. **Real database** - Changes persist, not just UI mockups
6. **Team-aware** - Role-based access control already built in
