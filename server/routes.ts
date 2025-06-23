import type { Express } from "express"; import { createServer, type Server } from "http"; import { WebSocketServer } from "ws"; import { storage } from "./storage"; import { setupAuth, isAuthenticated } from "./replitAuth"; import { insertPostSchema, insertStorySchema, insertMessageSchema, insertProductSchema, insertCommentSchema } from "@shared/schema"; import { z } from "zod"; import bcrypt from "bcryptjs";

export async function registerRoutes(app: Express): Promise<Server> { await setupAuth(app);

// --- AUTH: Register --- app.post('/api/register', async (req, res) => { try { const { username, password } = req.body; const existingUser = await storage.getUserByUsername(username); if (existingUser) { return res.status(400).json({ message: "Username already taken" }); } const hashedPassword = await bcrypt.hash(password, 10); const user = await storage.createUser({ username, password: hashedPassword }); res.json({ message: "User created successfully", user }); } catch (error) { console.error("Register error:", error); res.status(500).json({ message: "Registration failed" }); } });

// --- AUTH: Login --- app.post('/api/login', async (req, res) => { try { const { username, password } = req.body; const user = await storage.getUserByUsername(username); if (!user) { return res.status(401).json({ message: "Invalid credentials" }); } const valid = await bcrypt.compare(password, user.password); if (!valid) { return res.status(401).json({ message: "Invalid credentials" }); } res.json({ message: "Login successful", user }); } catch (error) { console.error("Login error:", error); res.status(500).json({ message: "Login failed" }); } });

// --- AUTH: Current User --- app.get('/api/auth/user', isAuthenticated, async (req: any, res) => { try { const userId = req.user.claims.sub; const user = await storage.getUser(userId); res.json(user); } catch (error) { console.error("Error fetching user:", error); res.status(500).json({ message: "Failed to fetch user" }); } });

// --- POSTS --- app.post('/api/posts', isAuthenticated, async (req: any, res) => { try { const data = insertPostSchema.parse({ ...req.body, userId: req.user.claims.sub }); const post = await storage.createPost(data); res.json(post); } catch (error) { res.status(400).json({ message: "Invalid post data" }); } });

app.get('/api/feed', isAuthenticated, async (req: any, res) => { const posts = await storage.getFeedPosts(req.user.claims.sub); res.json(posts); });

app.get('/api/posts/:id', async (req, res) => { const post = await storage.getPostById(Number(req.params.id)); post ? res.json(post) : res.status(404).json({ message: "Post not found" }); });

app.post('/api/posts/:id/like', isAuthenticated, async (req: any, res) => { await storage.likePost(req.user.claims.sub, Number(req.params.id)); res.json({ liked: true }); });

app.post('/api/posts/:id/unlike', isAuthenticated, async (req: any, res) => { await storage.unlikePost(req.user.claims.sub, Number(req.params.id)); res.json({ liked: false }); });

// --- COMMENTS --- app.post('/api/comments', isAuthenticated, async (req: any, res) => { try { const comment = insertCommentSchema.parse({ ...req.body, userId: req.user.claims.sub }); const result = await storage.createComment(comment); res.json(result); } catch { res.status(400).json({ message: "Invalid comment data" }); } });

app.get('/api/posts/:id/comments', async (req, res) => { const comments = await storage.getPostComments(Number(req.params.id)); res.json(comments); });

// --- STORIES --- app.post('/api/stories', isAuthenticated, async (req: any, res) => { try { const story = insertStorySchema.parse({ ...req.body, userId: req.user.claims.sub }); const result = await storage.createStory(story); res.json(result); } catch { res.status(400).json({ message: "Invalid story data" }); } });

app.get('/api/stories', isAuthenticated, async (req: any, res) => { const stories = await storage.getActiveStories(req.user.claims.sub); res.json(stories); });

// --- MESSAGES --- app.post('/api/conversations/start', isAuthenticated, async (req: any, res) => { const { userId } = req.body; const id = await storage.getOrCreateConversation(req.user.claims.sub, userId); res.json({ conversationId: id }); });

app.get('/api/conversations', isAuthenticated, async (req: any, res) => { const list = await storage.getUserConversations(req.user.claims.sub); res.json(list); });

app.post('/api/messages', isAuthenticated, async (req: any, res) => { const message = insertMessageSchema.parse({ ...req.body, senderId: req.user.claims.sub }); const saved = await storage.createMessage(message); res.json(saved); });

app.get('/api/conversations/:id/messages', isAuthenticated, async (req, res) => { const messages = await storage.getConversationMessages(req.params.id); res.json(messages); });

// --- PRODUCTS --- app.post('/api/products', isAuthenticated, async (req: any, res) => { try { const product = insertProductSchema.parse({ ...req.body, sellerId: req.user.claims.sub }); const saved = await storage.createProduct(product); res.json(saved); } catch { res.status(400).json({ message: "Invalid product data" }); } });

app.get('/api/products', async (req, res) => { const products = await storage.getProducts(req.query.category as string); res.json(products); });

app.get('/api/products/:id', async (req, res) => { const product = await storage.getProductById(Number(req.params.id)); product ? res.json(product) : res.status(404).json({ message: "Product not found" }); });

// --- FOLLOW SYSTEM --- app.post('/api/follow/:id', isAuthenticated, async (req: any, res) => { await storage.followUser(req.user.claims.sub, req.params.id); res.json({ following: true }); });

app.post('/api/unfollow/:id', isAuthenticated, async (req: any, res) => { await storage.unfollowUser(req.user.claims.sub, req.params.id); res.json({ following: false }); });

app.get('/api/user/:id/stats', async (req, res) => { const stats = await storage.getUserStats(req.params.id); res.json(stats); });

// --- WEBSOCKET --- const httpServer = createServer(app); const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

wss.on('connection', (ws) => { console.log('New WebSocket connection'); ws.on('message', (data) => { try { const message = JSON.parse(data.toString()); console.log('Received message:', message); ws.send(JSON.stringify({ type: 'echo', data: message })); } catch (error) { console.error('Error processing WebSocket message:', error); } }); ws.on('close', () => { console.log('WebSocket connection closed'); }); });

return httpServer; }

