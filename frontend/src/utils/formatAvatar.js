export const formatAvatarUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return '/avatars/default.jpg';
  }

  // 1. Strip extra quotes (e.g. ""C:\Users..."" or "C:\Users...")
  let clean = url.trim().replace(/^['"]+|['"]+$/g, '').trim();

  if (!clean) {
    return '/avatars/default.jpg';
  }

  // 2. If user pasted a full Windows disk path containing "public"
  if (clean.toLowerCase().includes('public')) {
    const parts = clean.split(/public[\\/]/i);
    if (parts.length > 1) {
      clean = parts[1];
    }
  } else if (clean.toLowerCase().includes('avatars')) {
    // If it contains "avatars" anywhere e.g. C:\...\avatars\myphoto.jpg
    const parts = clean.split(/avatars[\\/]/i);
    if (parts.length > 1) {
      clean = `avatars/${parts[1]}`;
    }
  }

  // 3. Normalize all backslashes to forward slashes
  clean = clean.replace(/\\/g, '/');

  // 4. Ensure relative path starts with /
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    if (!clean.startsWith('/')) {
      clean = `/${clean}`;
    }
    // Make sure it leads to /avatars/
    if (!clean.startsWith('/avatars/')) {
      clean = `/avatars${clean}`;
    }
  }

  // 5. Safely encode spaces in filename for web browser compatibility
  // e.g. /avatars/WhatsApp Image 2026-04-10 at 20.01.01.jpeg -> /avatars/WhatsApp%20Image%202026-04-10%20at%2020.01.01.jpeg
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = clean.split('/').map(part => encodeURIComponent(part)).join('/');
    // Re-fix leading slash after join
    if (!clean.startsWith('/')) {
      clean = `/${clean}`;
    }
  }

  return clean;
};
