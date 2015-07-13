try:
    from functools import lru_cache
except ImportError:
    from functools import wraps

    def lru_cache(maxsize=128):
        """Simple cache decorator with limited size.

        Cache will delete a random key once size limit is
        reached."""

        def decorator(func):
            cache = {}

            @wraps(func)
            def wrapped(*args):
                if args in cache:
                    return cache[args]
                result = func(*args)
                if len(cache) >= maxsize:
                    cache.popitem()
                cache[args] = result
                return result

            return wrapped

        return decorator
