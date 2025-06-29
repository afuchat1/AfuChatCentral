import {
  users,
  posts,
  stories,
  messages,
  products,
  comments,
  likes,
  follows,
  conversations,
  conversationParticipants,
  reports,
  userBans,
  type User,
  type UpsertUser,
  type InsertPost,
  type Post,
  type InsertStory,
  type Story,
  type InsertMessage,
  type Message,
  type InsertProduct,
  type Product,
  type InsertComment,
  type Comment,
  type Like,
  type Follow,
  type Conversation,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql, count, gte } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  
  // Post operations
  createPost(post: InsertPost): Promise<Post>;
  getFeedPosts(userId: string, limit?: number): Promise<Post[]>;
  getPostById(id: number): Promise<Post | undefined>;
  likePost(userId: string, postId: number): Promise<void>;
  unlikePost(userId: string, postId: number): Promise<void>;
  isPostLiked(userId: string, postId: number): Promise<boolean>;
  
  // Story operations
  createStory(story: InsertStory): Promise<Story>;
  getActiveStories(userId: string): Promise<Story[]>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getConversationMessages(conversationId: string, limit?: number): Promise<Message[]>;
  getOrCreateConversation(participant1: string, participant2: string): Promise<string>;
  getUserConversations(userId: string): Promise<any[]>;
  
  // Product operations
  createProduct(product: InsertProduct): Promise<Product>;
  getProducts(category?: string, limit?: number): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  
  // Comment operations
  createComment(comment: InsertComment): Promise<Comment>;
  getPostComments(postId: number, limit?: number): Promise<Comment[]>;
  
  // Follow operations
  followUser(followerId: string, followingId: string): Promise<void>;
  unfollowUser(followerId: string, followingId: string): Promise<void>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  getUserStats(userId: string): Promise<{ posts: number; followers: number; following: number }>;
  
  // Admin operations
  getAdminStats(): Promise<{ totalUsers: number; totalPosts: number; pendingReports: number; activeBans: number; recentActivity: number }>;
  getReports(status?: string): Promise<any[]>;
  createReport(report: any): Promise<any>;
  reviewReport(reportId: number, reviewerId: string, action: string, actionTaken?: string): Promise<void>;
  getBans(activeOnly?: boolean): Promise<any[]>;
  createBan(ban: any): Promise<any>;
  revokeBan(banId: number): Promise<void>;
  isUserBanned(userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async getFeedPosts(userId: string, limit: number = 20): Promise<Post[]> {
    return await db
      .select({
        id: posts.id,
        userId: posts.userId,
        content: posts.content,
        imageUrl: posts.imageUrl,
        isSponsored: posts.isSponsored,
        likesCount: posts.likesCount,
        commentsCount: posts.commentsCount,
        createdAt: posts.createdAt,
        user: {
          id: users.id,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
          isVerified: users.isVerified,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .orderBy(desc(posts.createdAt))
      .limit(limit);
  }

  async getPostById(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async likePost(userId: string, postId: number): Promise<void> {
    await db.insert(likes).values({ userId, postId }).onConflictDoNothing();
    await db
      .update(posts)
      .set({ likesCount: sql`${posts.likesCount} + 1` })
      .where(eq(posts.id, postId));
  }

  async unlikePost(userId: string, postId: number): Promise<void> {
    await db.delete(likes).where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
    await db
      .update(posts)
      .set({ likesCount: sql`${posts.likesCount} - 1` })
      .where(eq(posts.id, postId));
  }

  async isPostLiked(userId: string, postId: number): Promise<boolean> {
    const [like] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
    return !!like;
  }

  async createStory(story: InsertStory): Promise<Story> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Stories expire after 24 hours
    
    const [newStory] = await db
      .insert(stories)
      .values({ ...story, expiresAt })
      .returning();
    return newStory;
  }

  async getActiveStories(userId: string): Promise<Story[]> {
    return await db
      .select({
        id: stories.id,
        userId: stories.userId,
        content: stories.content,
        mediaUrl: stories.mediaUrl,
        mediaType: stories.mediaType,
        backgroundColor: stories.backgroundColor,
        viewsCount: stories.viewsCount,
        createdAt: stories.createdAt,
        expiresAt: stories.expiresAt,
        user: {
          id: users.id,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
        },
      })
      .from(stories)
      .leftJoin(users, eq(stories.userId, users.id))
      .where(sql`${stories.expiresAt} > NOW()`)
      .orderBy(desc(stories.createdAt));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async getConversationMessages(conversationId: string, limit: number = 50): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt))
      .limit(limit);
  }

  async getOrCreateConversation(participant1: string, participant2: string): Promise<string> {
    // Check if conversation already exists
    const existing = await db
      .select({ id: conversations.id })
      .from(conversations)
      .leftJoin(conversationParticipants, eq(conversations.id, conversationParticipants.conversationId))
      .where(
        and(
          eq(conversations.isGroup, false),
          or(
            and(
              sql`${conversationParticipants.userId} = ${participant1}`,
              sql`EXISTS (SELECT 1 FROM ${conversationParticipants} WHERE ${conversationParticipants.conversationId} = ${conversations.id} AND ${conversationParticipants.userId} = ${participant2})`
            )
          )
        )
      );

    if (existing.length > 0) {
      return existing[0].id;
    }

    // Create new conversation
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await db.insert(conversations).values({
      id: conversationId,
      isGroup: false,
    });

    await db.insert(conversationParticipants).values([
      { conversationId, userId: participant1 },
      { conversationId, userId: participant2 },
    ]);

    return conversationId;
  }

  async getUserConversations(userId: string): Promise<any[]> {
    return await db
      .select({
        id: conversations.id,
        name: conversations.name,
        isGroup: conversations.isGroup,
        lastMessageAt: conversations.lastMessageAt,
        otherUser: {
          id: users.id,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
        },
      })
      .from(conversations)
      .leftJoin(conversationParticipants, eq(conversations.id, conversationParticipants.conversationId))
      .leftJoin(users, and(
        eq(conversationParticipants.userId, users.id),
        sql`${users.id} != ${userId}`
      ))
      .where(sql`${conversations.id} IN (
        SELECT ${conversationParticipants.conversationId} 
        FROM ${conversationParticipants} 
        WHERE ${conversationParticipants.userId} = ${userId}
      )`)
      .orderBy(desc(conversations.lastMessageAt));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async getProducts(category?: string, limit: number = 20): Promise<Product[]> {
    let whereConditions = [eq(products.inStock, true)];
    
    if (category) {
      whereConditions.push(eq(products.category, category));
    }

    return await db
      .select({
        id: products.id,
        sellerId: products.sellerId,
        name: products.name,
        description: products.description,
        price: products.price,
        imageUrl: products.imageUrl,
        category: products.category,
        rating: products.rating,
        reviewsCount: products.reviewsCount,
        inStock: products.inStock,
        createdAt: products.createdAt,
        seller: {
          id: users.id,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
        },
      })
      .from(products)
      .leftJoin(users, eq(products.sellerId, users.id))
      .where(whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0])
      .orderBy(desc(products.createdAt))
      .limit(limit);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    
    // Update comment count
    await db
      .update(posts)
      .set({ commentsCount: sql`${posts.commentsCount} + 1` })
      .where(eq(posts.id, comment.postId));
      
    return newComment;
  }

  async getPostComments(postId: number, limit: number = 20): Promise<Comment[]> {
    return await db
      .select({
        id: comments.id,
        userId: comments.userId,
        postId: comments.postId,
        content: comments.content,
        createdAt: comments.createdAt,
        user: {
          id: users.id,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
        },
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt))
      .limit(limit);
  }

  async followUser(followerId: string, followingId: string): Promise<void> {
    await db.insert(follows).values({ followerId, followingId }).onConflictDoNothing();
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    await db
      .delete(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const [follow] = await db
      .select()
      .from(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));
    return !!follow;
  }

  async getUserStats(userId: string): Promise<{ posts: number; followers: number; following: number }> {
    const [postsCount] = await db
      .select({ count: count() })
      .from(posts)
      .where(eq(posts.userId, userId));

    const [followersCount] = await db
      .select({ count: count() })
      .from(follows)
      .where(eq(follows.followingId, userId));

    const [followingCount] = await db
      .select({ count: count() })
      .from(follows)
      .where(eq(follows.followerId, userId));

    return {
      posts: postsCount.count,
      followers: followersCount.count,
      following: followingCount.count,
    };
  }

  // Admin operations
  async getAdminStats(): Promise<{ totalUsers: number; totalPosts: number; pendingReports: number; activeBans: number; recentActivity: number }> {
    const [usersCount] = await db.select({ count: count() }).from(users);
    const [postsCount] = await db.select({ count: count() }).from(posts);
    const [pendingReportsCount] = await db.select({ count: count() }).from(reports).where(eq(reports.status, "pending"));
    const [activeBansCount] = await db.select({ count: count() }).from(userBans).where(eq(userBans.isActive, true));

    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 7);
    const [recentActivityCount] = await db
      .select({ count: count() })
      .from(posts)
      .where(gte(posts.createdAt, recentDate));

    return {
      totalUsers: usersCount.count,
      totalPosts: postsCount.count,
      pendingReports: pendingReportsCount.count,
      activeBans: activeBansCount.count,
      recentActivity: recentActivityCount.count,
    };
  }

  async getReports(status?: string): Promise<any[]> {
    let query = db
      .select({
        id: reports.id,
        reporterId: reports.reporterId,
        reportedUserId: reports.reportedUserId,
        reportedPostId: reports.reportedPostId,
        category: reports.category,
        reason: reports.reason,
        status: reports.status,
        reviewedBy: reports.reviewedBy,
        reviewedAt: reports.reviewedAt,
        actionTaken: reports.actionTaken,
        createdAt: reports.createdAt,
      })
      .from(reports);

    if (status) {
      query = query.where(eq(reports.status, status));
    }

    const results = await query.orderBy(desc(reports.createdAt));
    
    // Get user details for each report
    const enrichedResults = await Promise.all(
      results.map(async (report) => {
        const [reporter, reportedUser] = await Promise.all([
          this.getUser(report.reporterId),
          report.reportedUserId ? this.getUser(report.reportedUserId) : null,
        ]);
        
        return {
          ...report,
          reporter: reporter ? { username: reporter.username } : null,
          reportedUser: reportedUser ? { username: reportedUser.username } : null,
        };
      })
    );

    return enrichedResults;
  }

  async createReport(reportData: any): Promise<any> {
    const result = await db.insert(reports).values(reportData).returning();
    return result[0];
  }

  async reviewReport(reportId: number, reviewerId: string, action: string, actionTaken?: string): Promise<void> {
    await db
      .update(reports)
      .set({
        status: action,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        actionTaken,
      })
      .where(eq(reports.id, reportId));
  }

  async getBans(activeOnly: boolean = false): Promise<any[]> {
    let query = db
      .select({
        id: userBans.id,
        userId: userBans.userId,
        bannedBy: userBans.bannedBy,
        reason: userBans.reason,
        banType: userBans.banType,
        durationHours: userBans.durationHours,
        expiresAt: userBans.expiresAt,
        isActive: userBans.isActive,
        createdAt: userBans.createdAt,
      })
      .from(userBans);

    if (activeOnly) {
      query = query.where(eq(userBans.isActive, true));
    }

    const results = await query.orderBy(desc(userBans.createdAt));
    
    // Get user details for each ban
    const enrichedResults = await Promise.all(
      results.map(async (ban) => {
        const [user, banner] = await Promise.all([
          this.getUser(ban.userId),
          this.getUser(ban.bannedBy),
        ]);
        return {
          ...ban,
          user: user ? { username: user.username } : null,
          banner: banner ? { username: banner.username } : null,
        };
      })
    );

    return enrichedResults;
  }

  async createBan(banData: any): Promise<any> {
    const ban = {
      ...banData,
      expiresAt: banData.banType === "temporary" && banData.durationHours 
        ? new Date(Date.now() + banData.durationHours * 60 * 60 * 1000)
        : null,
    };
    
    const result = await db.insert(userBans).values(ban).returning();
    return result[0];
  }

  async revokeBan(banId: number): Promise<void> {
    await db
      .update(userBans)
      .set({ isActive: false })
      .where(eq(userBans.id, banId));
  }

  async isUserBanned(userId: string): Promise<boolean> {
    const result = await db
      .select({ id: userBans.id })
      .from(userBans)
      .where(
        and(
          eq(userBans.userId, userId),
          eq(userBans.isActive, true),
          or(
            eq(userBans.banType, "permanent"),
            gte(userBans.expiresAt, new Date())
          )
        )
      )
      .limit(1);

    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
