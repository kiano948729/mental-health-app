using Microsoft.EntityFrameworkCore;
using SamenSterkerApi.Models;

namespace SamenSterkerApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<ProgressEntry> ProgressEntries { get; set; }
        public DbSet<CommunityPost> CommunityPosts { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<PostLike> PostLikes { get; set; }
        public DbSet<BuddyRelation> BuddyRelations { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<CommunityPostComment> CommunityPostComments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ProgressEntry>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(e => e.UserId);

            modelBuilder.Entity<CommunityPost>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(e => e.UserId);

            modelBuilder.Entity<ChatMessage>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(e => e.UserId);

            modelBuilder.Entity<PostLike>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(e => e.UserId);

            modelBuilder.Entity<PostLike>()
                .HasOne<CommunityPost>()
                .WithMany()
                .HasForeignKey(e => e.PostId);

            // Unieke combinatie van UserId en PostId voor likes
            modelBuilder.Entity<PostLike>()
                .HasIndex(e => new { e.UserId, e.PostId })
                .IsUnique();

            // BuddyRelation: unieke combinatie van UserId en BuddyId
            modelBuilder.Entity<BuddyRelation>()
                .HasIndex(e => new { e.UserId, e.BuddyId })
                .IsUnique();

            modelBuilder.Entity<BuddyRelation>()
                .Property(e => e.Status)
                .HasConversion<string>();

            modelBuilder.Entity<CommunityPostComment>()
                .HasOne<CommunityPost>()
                .WithMany()
                .HasForeignKey(e => e.PostId);
            modelBuilder.Entity<CommunityPostComment>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(e => e.UserId);
        }
    }
} 