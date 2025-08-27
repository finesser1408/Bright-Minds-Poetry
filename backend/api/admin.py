from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import Message, GalleryItem, UserProfile, Poem, Like, Comment

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at')
    search_fields = ('name', 'email', 'subject', 'content')
    list_filter = ('created_at',)
    date_hierarchy = 'created_at'

@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'item_type', 'media_type', 'author', 'published_date', 'thumbnail_preview')
    list_filter = ('item_type', 'media_type', 'published_date')
    search_fields = ('title', 'description', 'author', 'publisher')
    date_hierarchy = 'published_date'
    readonly_fields = ('thumbnail_preview',)
    filter_horizontal = ()
    raw_id_fields = ('poem',)
    prepopulated_fields = {}
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'item_type', 'media_type')
        }),
        ('Media', {
            'fields': ('media_file', 'thumbnail', 'thumbnail_preview')
        }),
        ('Content', {
            'fields': ('content', 'poem')
        }),
        ('Publication Details', {
            'fields': ('author', 'published_date', 'publisher', 'publication_date', 'isbn'),
            'classes': ('collapse',)
        }),
    )
    
    def thumbnail_preview(self, obj):
        if obj.thumbnail:
            return mark_safe(f'<img src="{obj.thumbnail.url}" style="max-height: 100px; max-width: 100px;" />')
        return "No thumbnail"
    thumbnail_preview.short_description = 'Thumbnail Preview'
    
    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        # Only show thumbnail field for document media type
        if obj and obj.media_type != 'document':
            fieldsets = list(fieldsets)
            fieldsets[1] = ('Media', {'fields': ('media_file',)})
        return fieldsets

# Register other models if they're not already registered
if not admin.site.is_registered(UserProfile):
    admin.site.register(UserProfile)

if not admin.site.is_registered(Poem):
    admin.site.register(Poem)

if not admin.site.is_registered(Like):
    admin.site.register(Like)

if not admin.site.is_registered(Comment):
    admin.site.register(Comment)
