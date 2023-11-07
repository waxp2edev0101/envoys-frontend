export default function ({ store, redirect }) {
    if (store.$auth.user) {
        let rules = store.$auth.user.fields[0].rules ?? [];
        if (rules.length === 0) {
            return redirect('/')
        }
    }
}